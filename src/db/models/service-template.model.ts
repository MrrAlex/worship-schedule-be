import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ServiceTemplateDocument = HydratedDocument<ServiceTemplate>;

@Schema()
export class ServiceTemplate {
  @Prop()
  name: string;

  @Prop()
  description: string;
}

export const ServiceTemplateSchema =
  SchemaFactory.createForClass(ServiceTemplate);
