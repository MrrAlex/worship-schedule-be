import { PartialType } from '@nestjs/mapped-types';

export class CreateCourseDto {
  _id: string;
  name: string;
  description: string;
}

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
