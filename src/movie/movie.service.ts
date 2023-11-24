import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types, isValidObjectId } from 'mongoose';
import { Observable, defaultIfEmpty, lastValueFrom } from 'rxjs';
import { ExceptionMessage, HttpStatusMessage } from 'src/interface/enum';
import { Movie } from 'src/movie/schemas/movies.schema';
import { CustomException } from 'src/utils/exception.util';
import { AddMovieDto } from './dto/add.movie.dto';
// import { NotificationService } from 'src/interface/notification.interface';
import { Client, ClientGrpc, ClientKafka, ClientMqtt, ClientProxy, ClientRMQ, Transport } from '@nestjs/microservices';
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


    constructor(
        @InjectModel(Movie.name) private MovieModel: Model<Movie>,
        @InjectModel(Comment.name) private CommentModel: Model<Comment>,
        @Inject('NOTIFICATION_PACKAGE') private NotificationClient: ClientGrpc,
        @Inject('AUTH_PACKAGE') private AuthClient: ClientGrpc,
        @Inject('USER_PACKAGE') private UserClient: ClientGrpc,
        @Inject('KAFKA_CLIENT') private kafkaClient: ClientKafka,
        @Inject('MQTT_CLIENT') private mqttClient: ClientMqtt,


    ) { }

    async onModuleInit() {
        // this.notificationService = this.NotificationClient.getService<NotificationService>('NotificationService');
        this.authService = this.AuthClient.getService<AuthService>('AuthService');
        this.userService = this.UserClient.getService<UserService>('UserService');
        this.kafkaClient.subscribeToResponseOf('movie.add');
        await this.kafkaClient.connect();
    }

    async onModuleDestroy() {
        await this.kafkaClient.close();
    }

    // getNoti(): Observable<string> {
    //     return this.notificationService.addMovie({ msg: 'rachna' });
    // }

    async getMovies(): Promise<any> {
        try {
            const movies = await this.MovieModel.find({}, { title: 1, year: 1 }).limit(5);

            if (!movies || movies.length === 0) {
                throw new CustomException(ExceptionMessage.NO_MOVIES_FOUND, HttpStatusMessage.NOT_FOUND).getError();
            }

            return movies;
        } catch (error) {
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


            const newMovie = new this.MovieModel(addMovieDto);
            await newMovie.save();


            const observable = this.userService.getSubscriber({ request: true });
            const data = await lastValueFrom(observable);                        // data is object {emails: []}

            if (data.emails && data.emails.length > 0) {
                await lastValueFrom(
                    this.kafkaClient.send('movie.add', {
                        key: '1',
                        value: {
                            data: data,
                            title: title,
                        },
                    }),
                );
            }

            return;
        } catch (error) {
            throw error;
        }
    }

   

    async addComment(addCommentDto: AddCommentDto, id: string, movieId: string): Promise<any> {
        try {
            const { text } = addCommentDto;

            const result = this.userService.getNameEmail({ id });
            const userData = await lastValueFrom(result);

            if (!userData || !userData.name || !userData.email) {
                throw new CustomException(ExceptionMessage.USER_DATA_NOT_FOUND, HttpStatusMessage.NOT_FOUND).getError();
            }

            const movie = await this.MovieModel.findById(movieId);
            if (!movie) {
                throw new CustomException(ExceptionMessage.MOVIE_NOT_FOUND, HttpStatusMessage.NOT_FOUND).getError();
            }

            const comment = new this.CommentModel({
                text: text,
                name: userData.name,
                email: userData.email,
                movieId: new Types.ObjectId(movieId),
            });

            await comment.save();

            const observable = this.userService.getSubscriber({ request: true });
            const data = await lastValueFrom(observable);

            if (data.emails && data.emails.length > 0) {
                const mqttData = {
                    name: userData.name,
                    text: text,
                    email: userData.email,
                    subscriberEmails: data,
                    movieName: movie.title,
                };
                await lastValueFrom(this.mqttClient.send('notification.add.comment', mqttData));
            }

            return;
        } catch (error) {
            throw error;
        }
    }

  

    async getMovieById(movieId: string): Promise<any> {
        try {
            if (!isValidObjectId(movieId)) {
                throw new CustomException(ExceptionMessage.INVALID_MOVIE_ID, HttpStatusMessage.BAD_REQUEST).getError();
            }

            const movie = await this.MovieModel.findById(movieId);

            if (!movie) {
                throw new CustomException(ExceptionMessage.MOVIE_NOT_FOUND, HttpStatusMessage.NOT_FOUND).getError();
            }

            return movie;
        } catch (error) {
            throw error;
        }
    }

    async updateMovie(movieId: string, updatedMovieDto: UpdateMovieDto): Promise<any> {
        try {

            if (!isValidObjectId(movieId)) {
                throw new CustomException(ExceptionMessage.INVALID_MOVIE_ID, HttpStatusMessage.BAD_REQUEST).getError();
            }

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
            throw error

        }
    }


    async deleteMovie(movieId: string): Promise<Movie> {
        try {

            if (!isValidObjectId(movieId)) {
                throw new CustomException(ExceptionMessage.INVALID_MOVIE_ID, HttpStatusMessage.BAD_REQUEST).getError();
            }

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

            if (!isValidObjectId(movieId)) {
                throw new CustomException(ExceptionMessage.INVALID_MOVIE_ID, HttpStatusMessage.BAD_REQUEST).getError();
            }

            const id = new Types.ObjectId(movieId)
            const comments = await this.CommentModel.find({ movieId: id });

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

            if (!isValidObjectId(commentId)) {
                throw new CustomException(ExceptionMessage.INVALID_COMMENT_ID, HttpStatusMessage.BAD_REQUEST).getError();
            }

            const { text } = updateCommentdto;
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

            if (!isValidObjectId(commentId)) {
                throw new CustomException(ExceptionMessage.INVALID_COMMENT_ID, HttpStatusMessage.BAD_REQUEST).getError();
            }

            const deletedComment = await this.CommentModel.findByIdAndDelete(commentId);

            if (!deletedComment) {
                throw new CustomException(ExceptionMessage.COMMENT_NOT_FOUND, HttpStatusMessage.NOT_FOUND).getError();
            }

            return;
        } catch (error) {
            throw error;
        }
    }


    async searchMovie(queryData: string): Promise<any> {
        try {

            if (!queryData ) {
                throw new CustomException(ExceptionMessage.INVALID_SEARCH_QUERY, HttpStatusMessage.BAD_REQUEST).getError();
            }

            const pipeline = [
                {
                    $search: {
                        index: "text-search",
                        text: {
                            query: queryData,
                            path: "title",
                            fuzzy: {
                                "maxEdits": 1,
                                "prefixLength": 1,
                                "maxExpansions": 256
                            }
                        },
                    }
                },
                {
                    $project: {
                        _id: 0,
                        title: 1,
                        score: {
                            $meta: "searchScore"
                        },
                    }
                }
            ]

            const searchResults = await this.MovieModel.aggregate(pipeline);

            if (!searchResults || searchResults.length === 0) {
                throw new CustomException(ExceptionMessage.NO_SEARCH_RESULTS, HttpStatusMessage.NOT_FOUND).getError();
            }

            return searchResults;
        } catch (error) {
            throw error;
        }
    }


}
