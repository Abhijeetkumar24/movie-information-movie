import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from 'src/schemas/movies.schema';
import { GuardsModule } from 'src/guards/guards.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { KafkaConfig } from 'kafkajs';


@Module({
  imports: [
    GuardsModule,
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
  
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
      // {
      //   name: 'KAFKA_CLIENT', // You can give your client a unique name
      //   transport: Transport.KAFKA,
      //   options: {
      //     client: {
      //       brokers: ['localhost:9092'],
      //     },
      //   },
      // },

      // {
      //   name: 'NOTIFICATION_SERVICE',
      //   transport: Transport.KAFKA,
      //   options: {
      //     client: {
      //       clientId: 'notification',
      //       brokers: ['192.168.2.151:9092'],
      //     },
      //     consumer: {
      //       groupId: 'notification-consumer'
      //     }
      //   }
      // },

    ]),
  ],
  controllers: [MovieController],
  providers: [MovieService]
})
export class MovieModule { }
