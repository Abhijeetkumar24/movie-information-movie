import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from 'src/movie/schemas/movies.schema';
import { GuardsModule } from 'src/guards/guards.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { KafkaConfig } from 'kafkajs';
import { Comment, CommentSchema } from 'src/movie/schemas/comments.schema';


@Module({
  imports: [
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
          url: 'localhost:50051',
          package: 'auth',
          protoPath: join(__dirname, '../../../proto/auth.proto'),
        },
      },

      {
        name: 'NOTIFICATION_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50052',
          package: 'notification',
          protoPath: join(__dirname, '../../../proto/notification.proto'),
        },
      },

      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50053',
          package: 'user',
          protoPath: join(__dirname, '../../../proto/user.proto'),
        },
      },

      {
        name: 'MQTT_CLIENT',
        transport: Transport.MQTT,
        options: {
          url: 'mqtt://broker.hivemq.com',
        }
      },

      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['192.168.2.151:9092'],
          },
        },
      },
      
    ]),
  ],
  controllers: [MovieController],
  providers: [MovieService]
})
export class MovieModule { }
