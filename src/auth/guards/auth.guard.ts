// src/auth/guards/gql-auth.guard.ts

import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express'; // Import Express Request type

@Injectable()
// A custom AuthGuard for GraphQL requests using the JWT strategy
export class GqlAuthGuard extends AuthGuard('jwt') {
  /**
   * Override the getRequest method to extract the request from the GraphQL context.
   * This is necessary because GraphQL does not pass the HTTP request object directly
   * like REST does, so we must manually extract it from the context.
   */
  getRequest(context: ExecutionContext): Request {
    // Convert the regular execution context into a GraphQL-specific context
    const gqlContext = GqlExecutionContext.create(context);

    // Safely cast the request object to Express Request type
    const req = gqlContext.getContext<{ req: Request }>().req;

    console.log('req header', req.headers.authorization);

    return req;
  }
}
