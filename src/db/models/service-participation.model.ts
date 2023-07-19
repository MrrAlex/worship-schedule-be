import { HydratedDocument, Types } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ServiceParticipationDocument =
  HydratedDocument<ServiceParticipation>;

@Schema()
export class ServiceParticipation {
  @Prop()
  person: Types.ObjectId;

  @Prop()
  instrument: Types.ObjectId;

  @Prop()
  service: Types.ObjectId;
}

export const ServiceParticipationSchema =
  SchemaFactory.createForClass(ServiceParticipation);
