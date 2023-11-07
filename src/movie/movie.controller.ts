import { Body, Controller, Get, OnModuleDestroy, OnModuleInit, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ExceptionMessage, HttpStatusMessage, Role, SuccessMessage } from 'src/interface/enum';
import { responseUtils } from 'src/utils/response.util';
import { Request, Response } from 'express';
import { MovieService } from './movie.service';
import { AuthGuard } from 'src/guards/guards.service';
import { Roles } from 'src/decorators/role.decorator';
import { AddMovieDto } from './dto/add.movie.dto';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';

@Controller('movie')
export class MovieController implements OnModuleInit, OnModuleDestroy {

    constructor(
        private movieService: MovieService,

    ) { }

    @Client({
        transport: Transport.KAFKA,
        options: {
            client: {
                brokers: ['192.168.2.151:9092'],
            },
        },
    })
    private readonly client: ClientKafka;


    async onModuleInit() {
        const requestPatterns = [
            'math.sum.sync.kafka.message',
            'math.sum.sync.without.key',
            'math.sum.sync.plain.object',
            'math.sum.sync.array',
            'math.sum.sync.string',
            'math.sum.sync.number',
            'user.create',
            'business.create',
        ];

        requestPatterns.forEach(pattern => {
            this.client.subscribeToResponseOf(pattern);
        });

        await this.client.connect();
    }

    async onModuleDestroy() {
        await this.client.close();
    }



    @Post('mathSumSyncKafkaMessage')
    async mathSumSyncKafkaMessage(
        @Body() data: number[],
    ): Promise<Observable<any>> {
        console.log("hii 1: ", data)
        const result = await lastValueFrom(
            this.client.send('math.sum.sync.kafka.message', {
                key: '1',
                value: {
                    numbers: data,
                },
            }),
        );
        return result;
    }

    @Roles(Role.User)
    @UseGuards(AuthGuard)
    @Get()
    async getMovies(@Req() req: Request, @Res() res: Response) {
        try {
            console.log("req: ", req['user'].sub, req['user'].role)
            const response = await this.movieService.getMovies();
            let finalResponse = responseUtils.successResponse(
                response,
                SuccessMessage.GET_MOVIES_SUCCESS,
                HttpStatusMessage.OK
            )
            res.status(finalResponse.code).send(finalResponse);
        } catch (error) {
            let err = responseUtils.errorResponse(
                error,
                ExceptionMessage.MOVIE_LIST_ERROR,
            );
            res.status(err.code).send(err);
        }

    }

    @Roles(Role.Admin)
    @UseGuards(AuthGuard)
    @Post()
    async addMovies(@Body() addMovieDto: AddMovieDto, @Req() req: Request, @Res() res: Response) {
        try {
            console.log("baby")
            // console.log("req: ", req['user'].sub, req['user'].role)
            const response = await this.movieService.addMovie(addMovieDto);
            let finalResponse = responseUtils.successResponse(
                response,
                SuccessMessage.ADD_MOVIE_SUCCESSFULLY,
                HttpStatusMessage.OK
            )
            res.status(finalResponse.code).send(finalResponse);
        } catch (error) {
            let err = responseUtils.errorResponse(
                error,
                ExceptionMessage.ERROR_IN_MOVIE_ADDING,
            );
            res.status(err.code).send(err);
        }

    }

    @Get('noti')
    async Noti() {
        return this.movieService.getNoti();
    }


}
