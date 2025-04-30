// src/auth/strategies/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
// JwtStrategy is the Passport strategy for validating JWTs
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // Inject the ConfigService to access environment variables
    private readonly configService: ConfigService,

    // Inject the UserRepository to fetch user from DB
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    // Fetch the JWT secret from environment variables
    const jwtSecret = configService.get<string>('JWT_SECRET');

    // If JWT_SECRET is not defined, throw an error
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    // Call the parent constructor of PassportStrategy and configure it
    super({
      // Extract JWT from the "Authorization" header using Bearer scheme
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Do not ignore expired tokens — expired tokens will be rejected
      ignoreExpiration: false,

      // Use the JWT secret key for signature verification
      secretOrKey: jwtSecret,
    });
  }

  // This method is called automatically by Passport after JWT is validated
  // It allows you to attach the user data to the request object
  async validate(payload: any): Promise<Partial<User>> {
    // Step 1: Extract user ID from the JWT payload
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = Number(payload.sub);

    // Step 2: Attempt to find the user in the database
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    // Step 3: If user is not found, throw Unauthorized error
    if (!user) {
      throw new UnauthorizedException('User not found or no longer exists');
    }

    // Step 4: Return partial user data that will be attached to `req.user`
    // This object becomes available via the @CurrentUser() decorator
    return {
      id: user.id,
      username: user.username,
    };
  }
}
