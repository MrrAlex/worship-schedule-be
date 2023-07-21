import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Person } from './person.model';

export type ServiceDocument = HydratedDocument<Service>;

@Schema()
export class Service {
  @Prop()
  name: string;

  @Prop()
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'Person' })
  leader: Person | Types.ObjectId;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
