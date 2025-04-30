// src/department/department.service.ts

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentInput } from './dto/create-department.input';
import { User } from '../auth/entities/user.entity';
import { UpdateDepartmentInput } from './dto/update-department.input';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  /**
   * Create a new department associated with the authenticated user.
   * @param input - Department name and other input fields.
   * @param user - The user creating the department.
   */
  async create(input: CreateDepartmentInput, user: User): Promise<Department> {
    // confirm no department already have the same name
    const existingDepartment = await this.departmentRepository.findOne({
      where: {
        name: input.name,
      },
    });

    if (existingDepartment) {
      throw new BadRequestException(
        'A department with this name already exists, try another name',
      );
    }

    const department = this.departmentRepository.create({
      ...input,
      createdBy: user, // Set the current user as the creator
    });

    return await this.departmentRepository.save(department);
  }

  /**
   * Retrieve a paginated list of departments associated with the authenticated user.
   * @param user - The user attempting to retrieve the departments.
   * @param page - The current page of departments.
   * @param limit - The number of departments per page.
   * @returns A paginated list of departments associated with the user.
   */
  async findAll(
    user: User,
    page: number = 1,
    limit: number = 10,
  ): Promise<Department[]> {
    // Ensure that the page and limit are valid
    const skip = (page - 1) * limit;

    return await this.departmentRepository.find({
      where: {
        createdBy: { id: user.id }, // Only departments created by this user
      },
      relations: ['createdBy', 'subDepartments'], // Include sub-departments in the relations
      take: limit, // Number of departments to retrieve
      skip: skip, // Skip departments based on the current page
    });
  }

  /**
   * Updates a department associated with the authenticated user.
   * @param input - Department ID and updated name.
   * @param user - The user attempting to update the department.
   * @returns The updated department on success, otherwise throws an error.
   * @throws BadRequestException if the department does not exist.
   * @throws ForbiddenException if the user is not authorized to update the department.
   */
  async update(input: UpdateDepartmentInput, user: User): Promise<Department> {
    const { id, name } = input;

    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!department) {
      throw new BadRequestException('Department not found');
    }

    if (department.createdBy.id !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to update this department',
      );
    }

    // Only update if name is provided
    if (name !== undefined) {
      department.name = name;
    }

    return await this.departmentRepository.save(department);
  }

  /**
   * Deletes multiple departments associated with the authenticated user.
   * @param ids - List of Department IDs to delete.
   * @param user - The user attempting to delete the departments.
   * @returns true on success, otherwise throws an error.
   * @throws BadRequestException if some departments do not exist.
   * @throws ForbiddenException if the user does not have permission to delete one or more departments.
   */
  async deleteMany(ids: number[], user: User): Promise<boolean> {
    const departments = await this.departmentRepository.find({
      where: {
        id: In(ids),
      },
      relations: ['createdBy'],
    });

    // Ensure all departments exist
    if (departments.length !== ids.length) {
      throw new BadRequestException('Some departments were not found');
    }

    // Check permissions
    for (const dept of departments) {
      if (dept.createdBy.id !== user.id) {
        throw new ForbiddenException(
          `You do not have permission to delete department with ID ${dept.id}`,
        );
      }
    }

    // Delete departments
    // NB: Went for parmenent delete, if it were in amore serious app, we would seriously consider soft delete
    await this.departmentRepository.delete(ids);
    return true;
  }
}
