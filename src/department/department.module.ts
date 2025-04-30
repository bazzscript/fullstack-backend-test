// src/department/department.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { SubDepartment } from './entities/sub-department.entity';
import { DepartmentResolver } from './department.resolver';
import { DepartmentService } from './department.service';

@Module({
  imports: [TypeOrmModule.forFeature([Department, SubDepartment])],
  providers: [DepartmentResolver, DepartmentService],
})
export class DepartmentModule {}
