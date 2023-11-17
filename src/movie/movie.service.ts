import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Observable, defaultIfEmpty, lastValueFrom } from 'rxjs';
import { ExceptionMessage, HttpStatusMessage } from 'src/interface/enum';
import { Movie } from 'src/movie/schemas/movies.schema';
import { CustomException } from 'src/utils/exception.util';
import { AddMovieDto } from './dto/add.movie.dto';
// import { NotificationService } from 'src/interface/notification.interface';
import { Client, ClientGrpc, ClientKafka, ClientProxy, Transport } from '@nestjs/microservices';
import { AuthService, } from 'src/interface/auth.interface';
import { AddCommentDto } from './dto/add.comment.dto';
import { Comment } from './schemas/comments.schema';
import { UserService } from 'src/interface/user.interface';
import { UpdateMovieDto } from './dto/update.movie.dto';
import { UpdateCommentDto } from './dto/update.comment.dto';



@Injectable()
export class MovieService implements OnModuleInit, OnModuleDestroy {

    // private notificationService: NotificationService;
    private authService: AuthService;
    private userService: UserService;



    @Client({
        transport: Transport.KAFKA,
        options: {
            client: {
                brokers: ['192.168.2.151:9092'],
            },
        },
    })
    private readonly client: ClientKafka;

    @Client({
        transport: Transport.MQTT,
        options: {
            url: 'mqtt://broker.hivemq.com',
            // url: process.env.MQTTURL,
        }
    })
    mqttClient: ClientProxy;


    constructor(
        @InjectModel(Movie.name) private MovieModel: Model<Movie>,
        @InjectModel(Comment.name) private CommentModel: Model<Comment>,
        @Inject('NOTIFICATION_PACKAGE') private NotificationClient: ClientGrpc,
        @Inject('AUTH_PACKAGE') private AuthClient: ClientGrpc,
        @Inject('USER_PACKAGE') private UserClient: ClientGrpc,


    ) { }

    async onModuleInit() {
        // this.notificationService = this.NotificationClient.getService<NotificationService>('NotificationService');
        this.authService = this.AuthClient.getService<AuthService>('AuthService');
        this.userService = this.UserClient.getService<UserService>('UserService');
        this.client.subscribeToResponseOf('movie.add');
        await this.client.connect();
    }

    async onModuleDestroy() {
        await this.client.close();
    }

    // getNoti(): Observable<string> {
    //     return this.notificationService.addMovie({ msg: 'rachna' });
    // }

    async getMovies(): Promise<any> {
        try {
            return await this.MovieModel.find(
                {},
                { title: 1, year: 1 }
            ).limit(5);
        }
        catch (error) {
            throw error;
        }
    }


    async addMovie(addMovieDto: AddMovieDto): Promise<any> {
        try {
            const title = addMovieDto.title;
            const existingMovie = await this.MovieModel.findOne({ title });
            if (existingMovie) {
                throw new CustomException(ExceptionMessage.MOVIE_ALREADY_EXIST, HttpStatusMessage.CONFLICT).getError();
            }

            new this.MovieModel(addMovieDto).save();

            const observable = this.userService.getSubscriber({ request: true });
            observable.subscribe(async (emails) => {
                await lastValueFrom(
                    this.client.send('movie.add', {
                        key: '1',
                        value: {
                            data: emails,
                            title: title,
                        },
                    }),
                );

            })

            return;
        }
        catch (error) {
            throw error;
        }

    }


    async addComment(addCommentDto: AddCommentDto, id: string, movieId: string): Promise<any> {
        try {
            const { text } = addCommentDto;
            const result = this.userService.getNameEmail({ id });
            const userData = await lastValueFrom(result);

            const comment = new this.CommentModel({
                text: text,
                name: userData.name,
                email: userData.email,
                movieId: new Types.ObjectId(movieId),
            });


            await comment.save();


            const observable = this.userService.getSubscriber({ request: true });
            const emails = await lastValueFrom(observable);
            const movie = await this.MovieModel.findById(movieId)

            const mqttData = {
                name: userData.name,
                text: text,
                email: userData.email,
                subscriberEmails: emails,
                movieName: movie.title,
            };
            await lastValueFrom(this.mqttClient.send('notification.add.comment', mqttData));


            return;
        } catch (error) {
            throw new CustomException(ExceptionMessage.ERROR_IN_COMMENT_ADDING, HttpStatusMessage.BAD_REQUEST).getError();

        }
    }


    async getMovieById(movieId: string): Promise<any> {
        try {
            return await this.MovieModel.findById(movieId)

        } catch (error) {
            throw new CustomException(ExceptionMessage.ERROR_IN_MOVIE_FETCHING, HttpStatusMessage.BAD_REQUEST).getError();

        }
    }


    async updateMovie(movieId: string, updatedMovieDto: UpdateMovieDto): Promise<any> {
        try {
            const updatedMovie = await this.MovieModel.findByIdAndUpdate(
                movieId,
                updatedMovieDto,
                { new: true, runValidators: true }
            );
    
            if (!updatedMovie) {
                throw new CustomException(ExceptionMessage.MOVIE_NOT_FOUND, HttpStatusMessage.NOT_FOUND).getError();
            }
    
            return updatedMovie;

        } catch (error) {
            throw new CustomException(ExceptionMessage.ERROR_IN_MOVIE_UPDATE, HttpStatusMessage.BAD_REQUEST).getError();

        }
    }

    async deleteMovie(movieId: string): Promise<Movie> {
        try {
            const deletedMovie = await this.MovieModel.findByIdAndDelete(movieId);

            if (!deletedMovie) {
                throw new CustomException(ExceptionMessage.MOVIE_NOT_FOUND, HttpStatusMessage.NOT_FOUND).getError();
            }

            return deletedMovie;
        } catch (error) {
            throw error; 
        }
    }


    async getComments(movieId: string): Promise<Comment[]> {
        try {
            const id = new Types.ObjectId(movieId)
            const comments = await this.CommentModel.find({ movieId : id});
    
            if (comments.length === 0) {
                throw new CustomException(ExceptionMessage.COMMENTS_NOT_FOUND, HttpStatusMessage.NOT_FOUND).getError();
            }
    
            return comments;
        } catch (error) {
            throw error;
        }
    }


    async updateComment(commentId: string, updateCommentdto: UpdateCommentDto): Promise<Comment> {
        try {
             const {text} = updateCommentdto;
            const commentObjectId = new Types.ObjectId(commentId);
    
            const existingComment = await this.CommentModel.findOne({ _id: commentObjectId });
    
            if (!existingComment) {
                throw new CustomException(ExceptionMessage.COMMENT_NOT_FOUND, HttpStatusMessage.NOT_FOUND).getError();
            }

            existingComment.text = text;
            await existingComment.save();
    
            return existingComment;
        } catch (error) {
            throw error;
        }
    }


    async deleteComment(commentId: string): Promise<any> {
        try {
            const deletedComment = await this.CommentModel.findByIdAndDelete(commentId);

            if (!deletedComment) {
                throw new CustomException(ExceptionMessage.COMMENT_NOT_FOUND, HttpStatusMessage.NOT_FOUND).getError();
            }

            return ;
        } catch (error) {
            throw error; 
        }
    }

    
    async searchMovie (queryData: string): Promise<any> {
        try {
            const pipeline = [                                 
                    {
                        $search: {
                            index: "text-search",
                            text: {
                                query: queryData,
                                path: "title",
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            title: 1,
                            plot: 1
                        }
                    }
                ]
              
            return await this.MovieModel.aggregate(pipeline);
        } catch (error) {
            throw error; 
        }
    }


}
