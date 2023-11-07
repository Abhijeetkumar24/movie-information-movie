import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { ExceptionMessage, HttpStatusMessage } from 'src/interface/enum';
import { Movie } from 'src/schemas/movies.schema';
import { CustomException } from 'src/utils/exception.util';
import { AddMovieDto } from './dto/add.movie.dto';
import { NotificationService } from 'src/interface/notification.interface';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class MovieService implements OnModuleInit{

    private notificationService: NotificationService;


    constructor(
        @InjectModel(Movie.name) private MovieModel: Model<Movie>,
        @Inject('NOTIFICATION_PACKAGE') private NotificationClient: ClientGrpc,

    ) { }

    onModuleInit() {
        this.notificationService = this.NotificationClient.getService<NotificationService>('NotificationService');
        // this.authService = this.AuthClient.getService<AuthService>('AuthService');
    }

    getNoti(): Observable<string> {
        return this.notificationService.addMovie({ msg: 'rachna' });
    }

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
            console.log("noti res: ",this.getNoti().subscribe((result) => {console.log(result)}));
            const title  = addMovieDto.title;
            const existingMovie = await this.MovieModel.findOne({title});
            if (existingMovie) {
                throw new CustomException(ExceptionMessage.MOVIE_ALREADY_EXIST, HttpStatusMessage.CONFLICT).getError();
            }

            return new this.MovieModel(addMovieDto).save();
        }
        catch (error) {
            throw error;
        }

    }


   
    // addMovieNotification(): Observable<string>{
    //     console.log("hi 2222")
    //     return this.notificationService.addMovie({msg: "game"})
    //     //  obs.subscribe((result) => {
    //     //     console.log(result)
    //     // })
    //     // return obs;

    // }



}
