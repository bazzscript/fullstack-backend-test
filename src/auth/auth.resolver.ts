import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput, LoginInput } from './dto/auth.dto';
import { AuthResponse } from './dto/auth.response.dto';

// Register the resolver for GraphQL
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  // Sign-up mutation
  @Mutation(() => AuthResponse)
  async signup(@Args('input') input: SignupInput): Promise<AuthResponse> {
    // Pass data to the service to handle user creation
    return await this.authService.signUp(input);
  }

  // Login mutation
  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
    // Authenticate user and return JWT token
    return await this.authService.login(input);
  }
}
