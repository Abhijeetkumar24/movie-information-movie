
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {

    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop({ type: Types.ObjectId, ref: 'Movie' }) 
    movieId: Types.ObjectId;

    @Prop()
    text: string;

    @Prop({default: Date.now})
    date: Date; 

}

export const CommentSchema = SchemaFactory.createForClass(Comment);