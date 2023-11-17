import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    OnModuleInit,
    UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Request } from 'express';
import { AuthService } from 'src/interface/auth.interface';
import { Reflector } from '@nestjs/core';
import { ExceptionMessage, Role } from 'src/interface/enum';
import { ROLES_KEY } from 'src/decorators/role.decorator';


@Injectable()
export class AuthGuard implements CanActivate, OnModuleInit {

    private authService: AuthService;

    constructor(
        @Inject('AUTH_PACKAGE') private AuthClient: ClientGrpc,
        private reflector: Reflector,
    ) { }

    onModuleInit() {
        this.authService = this.AuthClient.getService<AuthService>('AuthService');
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }

        return new Promise<boolean>((resolve, reject) => {
            this.authService.guard({ token }).subscribe({
                next: (result) => {
                    if (result.valid) {

                        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
                            context.getHandler(),
                            context.getClass(),
                        ]);


                        if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.some(role => result.role.includes(role))) {
                            reject(new UnauthorizedException(ExceptionMessage.WRONG_ROLE));
                        }

                        request['user'] = { sub: result.userId, role: result.role };
                        resolve(true);
                    } else {
                        reject(new UnauthorizedException());
                    }
                },
            });
        });


    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

}

