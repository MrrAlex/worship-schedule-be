import { PartialType } from '@nestjs/mapped-types';

export class StudyModuleDto {
  _id: string;
  name: string;
}

export class UpdateStudyModuleDto extends PartialType(StudyModuleDto) {}
