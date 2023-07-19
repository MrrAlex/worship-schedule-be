import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceTemplate } from '../../models';
import { ServiceTemplateDto } from '../../../dto';

@Injectable()
export class ServiceTemplateService {
  constructor(
    @InjectModel(ServiceTemplate.name) private template: Model<ServiceTemplate>,
  ) {}

  create(dto: ServiceTemplateDto) {
    return this.template.create(dto);
  }

  delete(id: string) {
    return this.template.findByIdAndDelete(id);
  }

  update(dto: ServiceTemplateDto) {}

  findAll() {
    return this.template.find();
  }
}
