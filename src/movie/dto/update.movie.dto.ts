import { IsString, IsArray, IsNumber, IsDate, IsObject, IsOptional } from 'class-validator';

export class UpdateMovieDto {
    @IsString()
    @IsOptional()
    plot?: string;

    @IsArray()
    @IsOptional()
    genres?: string[];

    @IsNumber()
    @IsOptional()
    runtime?: number;

    @IsArray()
    @IsOptional()
    cast?: string[];

    @IsString()
    @IsOptional()
    poster?: string;

    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    fullplot?: string;

    @IsArray()
    @IsOptional()
    languages?: string[];

    @IsString()
    @IsOptional()
    released?: string;

    @IsArray()
    @IsOptional()
    directors?: string[];

    @IsString()
    @IsOptional()
    rated?: string;

    @IsObject()
    @IsOptional()
    awards?: {
        wins?: number;
        nominations?: number;
        text?: string;
    };

    @IsString()
    @IsOptional()
    lastupdated?: string;

    @IsNumber()
    @IsOptional()
    year?: number;

    @IsObject()
    @IsOptional()
    imdb?: {
        rating?: number;
        votes?: number;
        id?: number;
    };

    @IsArray()
    @IsOptional()
    countries?: string[];

    @IsString()
    @IsOptional()
    type?: string;

    @IsNumber()
    @IsOptional()
    num_mflix_comments?: number;
}
