// src/department/dto/create-department.input.ts

import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
class CreateSubDepartmentInput {
  @Field()
  @IsString()
  @MinLength(2)
  name: string;
}

@InputType()
export class CreateDepartmentInput {
  @Field()
  @IsString()
  @MinLength(2)
  name: string;

  @Field(() => [CreateSubDepartmentInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubDepartmentInput)
  subDepartments?: CreateSubDepartmentInput[];
}
