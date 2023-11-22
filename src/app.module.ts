import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MovieModule } from './movie/movie.module';
import { GuardsModule } from './guards/guards.module';


@Module({
  imports: [
    
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URL
      }),
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MovieModule,

    GuardsModule,

  ],
  controllers: [AppController],
  providers: [
    AppService,],
})
export class AppModule {}
