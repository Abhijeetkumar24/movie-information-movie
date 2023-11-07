import { IsString, IsArray, IsNumber, IsDate, IsObject } from 'class-validator';

export class AddMovieDto {


    @IsString()
    plot: string;

    @IsArray()
    genres: string[];

    @IsNumber()
    runtime: number;

    @IsArray()
    cast: string[];

    @IsString()
    poster: string;

    @IsString()
    title: string;

    @IsString()
    fullplot: string;

    @IsArray()
    languages: string[];

    @IsString()
    released: string;

    @IsArray()
    directors: string[];

    @IsString()
    rated: string;

    // @Prop(
    //     {
    //         type: {
    //             wins: Number,
    //             nominations: Number,
    //             text: String,
    //         },
    //     }
    // )
    @IsObject()
    awards: {
        wins: number;
        nominations: number;
        text: string;
    };

    @IsString()
    lastupdated: string;

    @IsNumber()
    year: number;

    // @Prop(
    //     {
    //         type: {
    //             rating: Number,
    //             votes: Number,
    //             id: Number
    //         }
    //     }
    // )
    @IsObject()
    imdb: {
        rating: number;
        votes: number;
        id: number;
    };

    @IsArray()
    countries: string[];

    @IsString()
    type: string;

    @IsNumber()
    num_mflix_comments: number;


}