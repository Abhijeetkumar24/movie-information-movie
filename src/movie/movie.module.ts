import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from 'src/movie/schemas/movies.schema';
import { GuardsModule } from 'src/guards/guards.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Comment, CommentSchema } from 'src/movie/schemas/comments.schema';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from 'src/providers/kafka/kafka.module';


@Module({
  imports: [
    KafkaModule,
    ConfigModule.forRoot({}),
    GuardsModule,
    MongooseModule.forFeature(
      [
        { name: Movie.name, schema: MovieSchema },
        { name: Comment.name, schema: CommentSchema },

      ]
    ),

    ClientsModule.register([
      {
        name: 'AUTH_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.AUTH_GRPC_URL,
          package: process.env.AUTH_PACKAGE,
          protoPath: process.env.AUTH_PROTO_PATH,
        },
      },
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.USER_GRPC_URL,
          package: process.env.USER_PACKAGE,
          protoPath: process.env.USER_PROTO_PATH,
        },
      },

      {
        name: 'MQTT_CLIENT',
        transport: Transport.MQTT,
        options: {
          url: process.env.MQTT_URL,
        }
      },

    ]),
  ],
  controllers: [MovieController],
  providers: [MovieService]
})
export class MovieModule { }
