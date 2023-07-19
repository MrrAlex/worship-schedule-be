import { Injectable } from '@nestjs/common';
import {
  ServiceTemplate,
  ServiceTemplateConfig,
  ServiceTemplateConfigDocument,
  ServiceTemplateDocument,
} from '../../models';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TemplateInstrumentConfig } from '../../../dto';

@Injectable()
export class ServiceTemplateConfigService {
  constructor(
    @InjectModel(ServiceTemplateConfig.name)
    private templateConfig: Model<ServiceTemplateConfigDocument>,
  ) {}

  async createMany(
    instruments: TemplateInstrumentConfig[],
    template: Types.ObjectId,
  ) {
    await this.deleteByTemplateId(template);
    for (const instConfig of instruments) {
      const templateConfig = new ServiceTemplateConfig();
      templateConfig.template = template;
      templateConfig.instrument = new Types.ObjectId(instConfig.instrument);
      templateConfig.members = instConfig.members;
      await this.templateConfig.create(templateConfig);
    }
  }

  deleteByTemplateId(template: Types.ObjectId) {
    return this.templateConfig.deleteMany({ template });
  }

  findConfigsForTemplate(id: string) {
    return this.templateConfig
      .find({
        template: new Types.ObjectId(id),
      })
      .populate('instrument');
  }
}
