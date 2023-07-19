import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ServiceTemplate } from './service-template.model';
import { Instrument } from './instrument.model';

export type ServiceTemplateConfigDocument =
  HydratedDocument<ServiceTemplateConfig>;

@Schema()
export class ServiceTemplateConfig {
  @Prop({ type: Types.ObjectId, ref: 'ServiceTemplate' })
  template: ServiceTemplate | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Instrument' })
  instrument: Instrument | Types.ObjectId;

  @Prop()
  members: number;
}

export const ServiceTemplateConfigSchema = SchemaFactory.createForClass(
  ServiceTemplateConfig,
);
