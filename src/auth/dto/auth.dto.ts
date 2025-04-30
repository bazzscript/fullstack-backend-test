import { InputType, Field } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';

// This DTO is for sign-up input validation
@InputType()
export class SignupInput {
  @Field()
  @IsString()
  @MinLength(3)
  username: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;
}

// DTO for login input
@InputType()
export class LoginInput {
  @Field()
  @IsString()
  username: string;

  @Field()
  @IsString()
  password: string;
}
