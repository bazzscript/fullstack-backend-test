// src/department/entities/sub-department.entity.ts

import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from './department.entity';

@ObjectType()
@Entity()
export class SubDepartment {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  // Many sub-departments belong to one department
  @ManyToOne(() => Department, (dept) => dept.subDepartments, {
    onDelete: 'CASCADE',
  })
  department: Department;
}
