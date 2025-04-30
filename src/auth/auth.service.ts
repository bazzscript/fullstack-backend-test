import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginInput, SignupInput } from './dto/auth.dto';
import { AuthResponse } from './dto/auth.response.dto';

@Injectable()
export class AuthService {
  constructor(
    // Inject User repository for database access
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    // Inject JwtService to generate JWT tokens
    private readonly jwtService: JwtService,
  ) {}

  // Handle user signup
  async signUp(input: SignupInput): Promise<AuthResponse> {
    const { username, password } = input;

    // Check for existing user
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });

    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(user);

    // Create JWT payload and sign token with expiration time
    const payload = { username, sub: savedUser.id };

    // Set expiration time to 7 days (can be any duration: '1h', '30m', '7d', etc.)
    const token = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return {
      accessToken: token,
      username: savedUser.username,
    };
  }

  // Handle user login and return JWT
  async login(input: LoginInput): Promise<AuthResponse> {
    const { username, password } = input;

    const user = await this.userRepository.findOne({ where: { username } });

    // Throw error if user doesn't exist
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare hashed passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create JWT payload and sign token with expiration time
    const payload = { username, sub: user.id };

    // Set expiration time to 7 days (can be any duration: '1h', '30m', '7d', etc.)
    const token = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return {
      accessToken: token,
      username: user.username,
    };
  }
}
