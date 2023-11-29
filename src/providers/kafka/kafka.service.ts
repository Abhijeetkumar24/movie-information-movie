import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka, Transport } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {

  constructor(
    @Inject('KAFKA_CLIENT') private kafkaClient: ClientKafka,

  ){}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('movie.add');
    await this.kafkaClient.connect();
  }

  async onModuleDestroy() {
    await this.kafkaClient.close();
  }

  async sendMovieData(key: string, value: any): Promise<void> {
    await lastValueFrom( this.kafkaClient.send('movie.add', {
      key,
      value,
      partition: 0,
    }))
  }
}

