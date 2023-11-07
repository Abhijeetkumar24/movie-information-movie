
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MovieDocument = HydratedDocument<Movie>;

@Schema()
export class Movie {

    @Prop()
    plot: string;

    @Prop([String])
    genres: string[];

    @Prop()
    runtime: number;

    @Prop([String])
    cast: string[];

    @Prop()
    poster: string;

    @Prop()
    title: string;

    @Prop()
    fullplot: string;

    @Prop([String])
    languages: string[];

    @Prop()
    released: Date;

    @Prop([String])
    directors: string[];

    @Prop()
    rated: string;

    @Prop(
        {
            type: {
                wins: Number,
                nominations: Number,
                text: String,
            },
        }
    )
    awards: {
        wins: number;
        nominations: number;
        text: string;
    };

    @Prop()
    lastupdated: Date;

    @Prop()
    year: number;

    @Prop(
        {
            type: {
                rating: Number,
                votes: Number,
                id: Number
            }
        }
    )
    imdb: {
        rating: number;
        votes: number;
        id: number;
    };

    @Prop([String])
    countries: string[];

    @Prop()
    type: string;

    @Prop()
    num_mflix_comments: number;

}

export const MovieSchema = SchemaFactory.createForClass(Movie);