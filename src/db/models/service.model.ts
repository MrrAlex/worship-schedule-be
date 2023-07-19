import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ServiceDocument = HydratedDocument<Service>;

@Schema()
export class Service {
  @Prop()
  name: string;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
