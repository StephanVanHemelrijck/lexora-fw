import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FirebaseUser } from '../types/firebase-user';

export const User = createParamDecorator(
  (data: keyof FirebaseUser | undefined, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest<{ user: FirebaseUser }>();
    const user = request.user;

    return data ? user?.[data] : user;
  }
);
