// src/auth/decorators/current-user.decorator.ts

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../../auth/entities/user.entity';

// Define the shape of the request context for GraphQL
interface GqlContext {
  req: {
    user: User;
  };
}

// Custom decorator to extract the current user from the GraphQL context
export const CurrentUser = createParamDecorator(
  <T = User>(_data: unknown, context: ExecutionContext): T => {
    const ctx = GqlExecutionContext.create(context);

    // Get the request object safely typed with user
    const request = ctx.getContext<GqlContext>().req;

    // Return the user with explicit typing
    return request.user as T;
  },
);
