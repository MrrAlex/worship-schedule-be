import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Instrument,
  InstrumentDocument,
  ServiceTemplate,
  ServiceTemplateDocument,
} from '../../models';
import { ServiceTemplateDto, TemplateInstrumentConfig } from '../../../dto';
import { ServiceTemplateConfigService } from '../service-template-config/service-template-config.service';

@Injectable()
export class ServiceTemplateService {
  constructor(
    @InjectModel(ServiceTemplate.name)
    private template: Model<ServiceTemplateDocument>,
    private serviceTemplateConfigService: ServiceTemplateConfigService,
  ) {}

  async create(dto: ServiceTemplateDto) {
    const template = new ServiceTemplate();
    template.name = dto.name;
    template.description = dto.description;
    const saved = await this.template.create(template);
    await this.serviceTemplateConfigService.createMany(
      dto.instruments,
      saved._id,
    );

    return saved;
  }

  async delete(id: string) {
    await this.template.findByIdAndDelete(id);
    await this.serviceTemplateConfigService.deleteByTemplateId(
      new Types.ObjectId(id),
    );
  }

  async update(id: string, dto: ServiceTemplateDto) {
    const found = await this.template.findById(id);
    found.name = dto.name;
    found.description = dto.description;
    await found.save();
    await this.serviceTemplateConfigService.createMany(
      dto.instruments,
      found._id,
    );

    return found;
  }

  findAll() {
    return this.template.find();
  }

  async findOne(id: string): Promise<ServiceTemplateDto> {
    const found = await this.template.findById(id);
    const templateConfigs =
      await this.serviceTemplateConfigService.findConfigsForTemplate(id);
    return {
      _id: id,
      name: found.name,
      description: found.description,
      instruments: templateConfigs.map((i): TemplateInstrumentConfig => {
        const instrument = i.instrument as InstrumentDocument;
        return {
          id: instrument.id,
          instrument: instrument.name,
          members: i.members,
        };
      }),
    };
  }
}
