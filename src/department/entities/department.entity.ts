// src/department/entities/department.entity.ts

import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubDepartment } from './sub-department.entity';
import { User } from '../../auth/entities/user.entity'; // Adjust path if needed

@ObjectType()
@Entity()
export class Department {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  // 👇 Relation to the user who created this department
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.departments, {
    nullable: false,
    eager: true,
  })
  createdBy: User;

  // 👇 One department can have many sub-departments
  @Field(() => [SubDepartment], { nullable: true })
  @OneToMany(() => SubDepartment, (sub) => sub.department, {
    cascade: true, // Automatically save sub-departments with department
  })
  subDepartments?: SubDepartment[];
}
