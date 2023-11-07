import { Module } from '@nestjs/common';
import { AuthGuard } from './guards.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';


@Module({
    imports: [
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
          ]),   
    ],
    providers: [AuthGuard],
    exports: [ ]
})
export class GuardsModule { }
