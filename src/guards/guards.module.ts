import { Module } from '@nestjs/common';
import { AuthGuard } from './guards.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({}),

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
    ]),
  ],
  providers: [AuthGuard],
  exports: []
})
export class GuardsModule { }
