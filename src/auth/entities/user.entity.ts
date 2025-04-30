import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Department } from 'src/department/entities/department.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType() // Marks class as GraphQL type
@Entity('users') // Tells TypeORM to use the "users" table
export class User {
  @Field(() => Int) // Expose id in GraphQL schema
  @PrimaryGeneratedColumn() // Auto-incremented primary key
  id: number;

  @Field() // Expose in GraphQL
  @Column({ unique: true }) // Add unique constraint in DB
  username: string;

  // Do not expose password in GraphQL
  @Column()
  password: string;

  // 👇 Add to User entity
  @OneToMany(() => Department, (department) => department.createdBy)
  departments: Department[];
}
