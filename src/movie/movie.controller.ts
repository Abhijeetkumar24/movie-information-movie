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
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CustomException } from 'src/utils/exception.util';
import { isValidObjectId } from 'mongoose';

@ApiTags('Movie')
@ApiBearerAuth()
@Controller('movie')
export class MovieController {

    constructor(
        private movieService: MovieService,

    ) { }

    /**
     * Retrieves a list of movies.
     *
     * @route GET /
     * @summary Get Movies
     * @description Retrieve a list of movies.
     * @param {Request} req - The HTTP request object.
     * @param {Response} res - The HTTP response object for sending the result.
     * @returns {Promise<void>} A Promise that resolves when the list of movies is retrieved.
     */
    @Roles(Role.User, Role.Admin)
    @UseGuards(AuthGuard)
    @Get()
    @ApiOperation({ summary: 'Get Movies', description: 'Retrieve a list of movies.' })
    async getMovies(@Req() req: Request, @Res() res: Response): Promise<void> {
        try {
            const response = await this.movieService.getMovies();
            let finalResponse = responseUtils.successResponse(
                response,
                SuccessMessage.GET_MOVIES_SUCCESS,
                HttpStatusMessage.OK
            );
            res.status(finalResponse.code).send(finalResponse);
        } catch (error) {
            let err = responseUtils.errorResponse(
                error,
                ExceptionMessage.MOVIE_LIST_ERROR,
            );
            res.status(err.code).send(err);
        }
    }

    /**
    * Adds a new movie.
    *
    * @route POST /
    * @summary Add Movie
    * @description Endpoint to add a new movie.
    * @param {AddMovieDto} addMovieDto - The data for adding a new movie.
    * @param {Request} req - The HTTP request object.
    * @param {Response} res - The HTTP response object for sending the result.
    * @returns {Promise<void>} A Promise that resolves when the movie is added successfully.
    */
    @Roles(Role.Admin)
    @UseGuards(AuthGuard)
    @Post()
    @ApiOperation({ summary: 'Add Movie', description: 'Endpoint to add a new movie.' })
    async addMovies(@Body() addMovieDto: AddMovieDto, @Req() req: Request, @Res() res: Response): Promise<void> {
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


    /**
    * Adds a comment to a movie.
    *
    * @route POST /:id/comment
    * @summary Add Comment
    * @description Endpoint to add a comment to a movie.
    * @param {string} id - The ID of the movie.
    * @param {AddCommentDto} addCommentDto - The data for adding a comment.
    * @param {Request} req - The HTTP request object.
    * @param {Response} res - The HTTP response object for sending the result.
    * @returns {Promise<void>} A Promise that resolves when the comment is added successfully.
    */
    @Roles(Role.User)
    @UseGuards(AuthGuard)
    @Post(':id/comment')
    @ApiOperation({ summary: 'Add Comment', description: 'Endpoint to add a comment to a movie.' })
    @ApiParam({ name: 'id', description: 'Movie ID' })
    async addComment(@Param('id') movieId: string, @Body() addCommentDto: AddCommentDto, @Req() req: Request, @Res() res: Response,): Promise<void> {
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

    /**
    * Retrieves a movie by its ID.
    *
    * @route GET /movie-id/:id
    * @summary Get Movie by ID
    * @description Endpoint to retrieve a movie by its ID.
    * @param {string} id - The ID of the movie.
    * @param {Request} req - The HTTP request object.
    * @param {Response} res - The HTTP response object for sending the result.
    * @returns {Promise<void>} A Promise that resolves when the movie is retrieved successfully.
    * @throws {CustomException} Throws a CustomException if there is an issue with the provided movie ID.
    */
    @Roles(Role.User, Role.Admin)
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get Movie by ID', description: 'Endpoint to retrieve a movie by its ID.' })
    @ApiParam({ name: 'id', description: 'Movie ID' })
    @Get('movie-id/:id')
    async GetMovieById(@Param('id') movieId: string, @Req() req: Request, @Res() res: Response): Promise<void> {
        try {
            if (!isValidObjectId(movieId)) {
                throw new CustomException(ExceptionMessage.INVALID_MOVIE_ID, HttpStatusMessage.BAD_REQUEST).getError();
            }

            const response = await this.movieService.getMovieById(movieId);

            if (!response) {
                throw new CustomException(ExceptionMessage.MOVIE_NOT_FOUND, HttpStatusMessage.NOT_FOUND).getError();
            }

            let finalResponse = responseUtils.successResponse(
                response,
                SuccessMessage.MOVIE_FETCH_SUCCESSFULLY,
                HttpStatusMessage.OK
            );
            res.status(finalResponse.code).send(finalResponse);
        } catch (error) {
            let err = responseUtils.errorResponse(
                error,
                ExceptionMessage.ERROR_IN_MOVIE_FETCHING,
            );
            res.status(err.code).send(err);
        }
    }


    /**
    * Updates a movie by its ID.
    *
    * @route PUT /:id
    * @summary Update Movie
    * @description Endpoint to update a movie by its ID.
    * @param {string} id - The ID of the movie.
    * @param {UpdateMovieDto} updatedMovieDto - The data for updating the movie.
    * @param {Request} req - The HTTP request object.
    * @param {Response} res - The HTTP response object for sending the result.
    * @returns {Promise<void>} A Promise that resolves when the movie is updated successfully.
    */
    @Roles(Role.Admin)
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Update Movie', description: 'Endpoint to update a movie by its ID.' })
    @ApiParam({ name: 'id', description: 'Movie ID' })
    @Put(':id')
    async UpdateMovie(@Param('id') movieId: string, @Body() updatedMovieDto: UpdateMovieDto, @Req() req: Request, @Res() res: Response): Promise<void> {
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


    /**
     * Deletes a movie by its ID.
     *
     * @route DELETE /:id
     * @summary Delete Movie
     * @description Endpoint to delete a movie by its ID.
     * @param {string} id - The ID of the movie.
     * @param {Request} req - The HTTP request object.
     * @param {Response} res - The HTTP response object for sending the result.
     * @returns {Promise<void>} A Promise that resolves when the movie is deleted successfully.
     */
    @Roles(Role.Admin)
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Delete Movie', description: 'Endpoint to delete a movie by its ID.' })
    @ApiParam({ name: 'id', description: 'Movie ID' })
    @Delete(':id')
    async DeleteMovie(@Param('id') movieId: string, @Req() req: Request, @Res() res: Response,): Promise<void>  {
        try {
            const response = await this.movieService.deleteMovie(movieId);
            let finalResponse = responseUtils.successResponse(
                response,
                SuccessMessage.MOVIE_DELETE_SUCCESSFULLY,
                HttpStatusMessage.OK
            )
            res.status(finalResponse.code).send(finalResponse);
        } catch (error) {
            console.log("h 22")
            let err = responseUtils.errorResponse(
                error,
                ExceptionMessage.ERROR_IN_MOVIE_DELETE,
            );
            res.status(err.code).send(err);
        }

    }

    /**
     * Retrieves a list of movies.
     *
     * @route GET /
     * @summary Get Movies
     * @description Retrieve a list of movies.
     * @param {Request} req - The HTTP request object.
     * @param {Response} res - The HTTP response object for sending the result.
     * @returns {Promise<void>} A Promise that resolves when the list of movies is retrieved.
     */
    @Roles(Role.User, Role.Admin)
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get Comments for Movie', description: 'Endpoint to retrieve comments for a movie by its ID.' })
    @ApiParam({ name: 'id', description: 'Movie ID' })
    @Get(':id/comments')
    async getComments(@Param('id') movieId: string, @Res() res: Response): Promise<void> {
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


    /**
     * Updates a comment by its ID.
     *
     * @route PUT /comment/:id
     * @summary Update Comment
     * @description Endpoint to update a comment by its ID.
     * @param {string} id - The ID of the comment.
     * @param {UpdateCommentDto} updateCommentdto - The data for updating the comment.
     * @param {Response} res - The HTTP response object for sending the result.
     * @returns {Promise<void>} A Promise that resolves when the comment is updated successfully.
     */
    @Roles(Role.User)
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Update Comment', description: 'Endpoint to update a comment by its ID.' })
    @ApiParam({ name: 'id', description: 'Comment ID' })
    @Put('comment/:id')
    async updateComment(@Param('id') commentId: string, @Body() updateCommentdto: UpdateCommentDto, @Res() res: Response): Promise<void> {
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


    /**
     * Deletes a comment by its ID.
     *
     * @route DELETE /comment/:id
     * @summary Delete Comment
     * @description Endpoint to delete a comment by its ID.
     * @param {string} id - The ID of the comment.
     * @param {Request} req - The HTTP request object.
     * @param {Response} res - The HTTP response object for sending the result.
     * @returns {Promise<void>} A Promise that resolves when the comment is deleted successfully.
     */    
    @Roles(Role.User)
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Delete Comment', description: 'Endpoint to delete a comment by its ID.' })
    @ApiParam({ name: 'id', description: 'Comment ID' })
    @Delete('comment/:id')
    async DeleteComment(@Param('id') commentId: string, @Req() req: Request, @Res() res: Response,): Promise<void> {
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


    /**
     * Searches for movies based on a query string.
     *
     * @route GET /search
     * @summary Search Movie
     * @description Endpoint to search for movies based on a query string.
     * @param {string} query - The search query.
     * @param {Request} req - The HTTP request object.
     * @param {Response} res - The HTTP response object for sending the result.
     * @returns {Promise<void>} A Promise that resolves when movies are successfully searched.
     */    
    @Roles(Role.User)
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Search Movie', description: 'Endpoint to search for movies based on a query string.' })
    @ApiQuery({ name: 'query', description: 'Search query', required: true })
    @Get('search')
    async SearchMovie(@Query('query') queryData: string, @Req() req: Request, @Res() res: Response,): Promise<void> {
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
