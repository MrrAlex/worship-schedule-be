import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Person } from './person.model';
import { Instrument } from './instrument.model';
import { Service } from './service.model';

export type ServiceParticipationDocument =
  HydratedDocument<ServiceParticipation>;

@Schema()
export class ServiceParticipation {
  @Prop({ type: Types.ObjectId, ref: 'Person' })
  person: Person | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Instrument' })
  instrument: Instrument | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Service' })
  service: Service | Types.ObjectId;

  @Prop()
  date: Date;
}

export const ServiceParticipationSchema =
  SchemaFactory.createForClass(ServiceParticipation);
