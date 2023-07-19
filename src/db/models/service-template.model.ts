import { HydratedDocument } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ServiceTemplateDocument = HydratedDocument<ServiceTemplate>;

@Schema()
export class ServiceTemplate {
  @Prop()
  name: string;

  @Prop(
    raw({
      instrument: { type: String },
      numberOfPeople: { type: Number },
    }),
  )
  config: Record<string, number>;
}

export const ServiceTemplateSchema =
  SchemaFactory.createForClass(ServiceTemplate);
