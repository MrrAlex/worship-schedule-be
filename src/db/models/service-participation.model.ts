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
  person: Person;

  @Prop({ type: Types.ObjectId, ref: 'Instrument' })
  instrument: Instrument;

  @Prop({ type: Types.ObjectId, ref: 'Service' })
  service: Service;
}

export const ServiceParticipationSchema =
  SchemaFactory.createForClass(ServiceParticipation);
