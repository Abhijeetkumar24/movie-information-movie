import { Body, Controller, Delete, Get, OnModuleDestroy, OnModuleInit, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ExceptionMessage, HttpStatusMessage, Role, SuccessMessage } from 'src/interface/enum';
import { responseUtils } from 'src/utils/response.util';
import { Request, Response } from 'express';
import { MovieService } from './movie.service';
import { AuthGuard } from 'src/guards/guards.service';
import { Roles } from 'src/decorators/role.decorator';
import { AddMovieDto } from './dto/add.movie.dto';
import { AddCommentDto } from './dto/add.comment.dto';
import { UpdateMovieDto } from './dto/update.movie.dto';
import { UpdateCommentDto } from './dto/update.comment.dto';

@Controller('movie')
export class MovieController implements OnModuleInit, OnModuleDestroy {

    constructor(
        private movieService: MovieService,

    ) { }

    async onModuleInit() {

    }

    async onModuleDestroy() {

    }


    @Roles(Role.User)
    @UseGuards(AuthGuard)
    @Get()
    async getMovies(@Req() req: Request, @Res() res: Response) {
        try {
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


    @Roles(Role.User)
    @UseGuards(AuthGuard)
    @Post(':id/comment')
    async addComment(@Param('id') movieId: string, @Body() addCommentDto: AddCommentDto, @Req() req: Request, @Res() res: Response,) {
        try {
            const response = await this.movieService.addComment(addCommentDto, req['user'].sub, movieId);
            let finalResponse = responseUtils.successResponse(
                response,
                SuccessMessage.ADD_COMMENT_SUCCESSFULLY,
                HttpStatusMessage.OK
            )
            res.status(finalResponse.code).send(finalResponse);
        } catch (error) {
            let err = responseUtils.errorResponse(
                error,
                ExceptionMessage.ERROR_IN_COMMENT_ADDING,
            );
            res.status(err.code).send(err);
        }

    }

    @Roles(Role.User)
    @UseGuards(AuthGuard)
    @Get('movie-id/:id')
    async GetMovieById(@Param('id') movieId: string, @Req() req: Request, @Res() res: Response,) {
        try {
            const response = await this.movieService.getMovieById(movieId);
            let finalResponse = responseUtils.successResponse(
                response,
                SuccessMessage.MOVIE_FETCH_SUCCESSFULLY,
                HttpStatusMessage.OK
            )
            res.status(finalResponse.code).send(finalResponse);
        } catch (error) {
            let err = responseUtils.errorResponse(
                error,
                ExceptionMessage.ERROR_IN_MOVIE_FETCHING,
            );
            res.status(err.code).send(err);
        }

    }



    @Roles(Role.Admin)
    @UseGuards(AuthGuard)
    @Put(':id')
    async UpdateMovie(@Param('id') movieId: string, @Body() updatedMovieDto: UpdateMovieDto, @Req() req: Request, @Res() res: Response,) {
        try {
            const response = await this.movieService.updateMovie(movieId, updatedMovieDto);
            let finalResponse = responseUtils.successResponse(
                response,
                SuccessMessage.MOVIE_UPDATE_SUCCESSFULLY,
                HttpStatusMessage.OK
            )
            res.status(finalResponse.code).send(finalResponse);
        } catch (error) {
            let err = responseUtils.errorResponse(
                error,
                ExceptionMessage.ERROR_IN_MOVIE_UPDATING,
            );
            res.status(err.code).send(err);
        }

    }


    @Roles(Role.Admin)
    @UseGuards(AuthGuard)
    @Delete(':id')
    async DeleteMovie(@Param('id') movieId: string, @Req() req: Request, @Res() res: Response,) {
        try {
            const response = await this.movieService.deleteMovie(movieId);
            let finalResponse = responseUtils.successResponse(
                response,
                SuccessMessage.MOVIE_DELETE_SUCCESSFULLY,
                HttpStatusMessage.OK
            )
            res.status(finalResponse.code).send(finalResponse);
        } catch (error) {
            let err = responseUtils.errorResponse(
                error,
                ExceptionMessage.ERROR_IN_MOVIE_DELETE,
            );
            res.status(err.code).send(err);
        }

    }


    @Roles(Role.User)
    @UseGuards(AuthGuard)
    @Get(':id/comments')
    async getComments(@Param('id') movieId: string, @Res() res: Response) {
        try {
            const response = await this.movieService.getComments(movieId);
            const finalResponse = responseUtils.successResponse(
                response,
                SuccessMessage.COMMENTS_RETRIEVED_SUCCESSFULLY,
                HttpStatusMessage.OK
            );
            res.status(finalResponse.code).send(finalResponse);
        } catch (error) {
            const err = responseUtils.errorResponse(
                error,
                ExceptionMessage.ERROR_IN_COMMENTS_RETRIEVAL,
            );
            res.status(err.code).send(err);
        }
    }


    @Roles(Role.User)
    @UseGuards(AuthGuard)
    @Put('comment/:id')
    async updateComment(@Param('id') commentId: string,@Body() updateCommentdto: UpdateCommentDto, @Res() res: Response) {
        try {
            const response = await this.movieService.updateComment(commentId, updateCommentdto);
            const finalResponse = responseUtils.successResponse(
                response,
                SuccessMessage.COMMENT_UPDATED_SUCCESSFULLY,
                HttpStatusMessage.OK
            );
            res.status(finalResponse.code).send(finalResponse);
        } catch (error) {
            const err = responseUtils.errorResponse(
                error,
                ExceptionMessage.ERROR_IN_COMMENT_UPDATE,
            );
            res.status(err.code).send(err);
        }
    }


    @Roles(Role.User)
    @UseGuards(AuthGuard)
    @Delete('comment/:id')
    async DeleteComment(@Param('id') commentId: string, @Req() req: Request, @Res() res: Response,) {
        try {
            const response = await this.movieService.deleteComment(commentId);
            let finalResponse = responseUtils.successResponse(
                response,
                SuccessMessage.COMMENT_DELETE_SUCCESSFULLY,
                HttpStatusMessage.OK
            )
            res.status(finalResponse.code).send(finalResponse);
        } catch (error) {
            let err = responseUtils.errorResponse(
                error,
                ExceptionMessage.ERROR_IN_COMMENT_DELETE,
            );
            res.status(err.code).send(err);
        }

    }


    @Roles(Role.User)
    @UseGuards(AuthGuard)
    @Get('search')
    async SearchMovie(@Query('query') queryData: string, @Req() req: Request, @Res() res: Response,) {
        try {
            const response = await this.movieService.searchMovie(queryData);
            let finalResponse = responseUtils.successResponse(
                response,
                SuccessMessage.MOVIE_SEARCH_SUCCESSFULLY,
                HttpStatusMessage.OK
            )
            res.status(finalResponse.code).send(finalResponse);
        } catch (error) {
            let err = responseUtils.errorResponse(
                error,
                ExceptionMessage.ERROR_IN_MOVIE_SEARCH,
            );
            res.status(err.code).send(err);
        }

    }


    // @Get('noti')
    // async Noti() {
    //     return this.movieService.getNoti();
    // }
    

}
