// src/department/department.resolver.ts

import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DepartmentService } from './department.service';
import { Department } from './entities/department.entity';
import { CreateDepartmentInput } from './dto/create-department.input';
import { GqlAuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { UpdateDepartmentInput } from './dto/update-department.input';

@Resolver(() => Department)
export class DepartmentResolver {
  constructor(private readonly departmentService: DepartmentService) {}

  /**
   * Creates a new department.
   * @param input - The input parameters for the department. See `CreateDepartmentInput`
   * @param user - The user creating the department, obtained from the current context.
   * @returns The created department.
   */
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Department)
  createDepartment(
    @Args('input') input: CreateDepartmentInput,
    @CurrentUser() user: User,
  ): Promise<Department> {
    return this.departmentService.create(input, user);
  }

  /**
   * Returns a list of departments for the currently authenticated user.
   * @returns A list of departments that the current user has created.
   */
  @UseGuards(GqlAuthGuard)
  @Query(() => [Department])
  getDepartments(@CurrentUser() user: User): Promise<Department[]> {
    return this.departmentService.findAll(user);
  }

  /**
   * Updates the details of an existing department.
   * @param input - The input parameters for updating the department. See `UpdateDepartmentInput`.
   * @param user - The user performing the update, obtained from the current context.
   * @returns The updated department.
   */

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Department)
  updateDepartment(
    @Args('input') input: UpdateDepartmentInput,
    @CurrentUser() user: User,
  ): Promise<Department> {
    return this.departmentService.update(input, user);
  }

  /**
   * Deletes multiple departments.
   * @param ids - An array of IDs of departments to delete.
   * @param user - The user performing the deletion, obtained from the current context.
   * @returns A boolean indicating whether the deletion was successful.
   */
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  deleteDepartments(
    @Args({ name: 'ids', type: () => [Int] }) ids: number[],
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.departmentService.deleteMany(ids, user);
  }
}
