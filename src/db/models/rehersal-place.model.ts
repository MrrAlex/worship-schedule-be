import { HydratedDocument, Types } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Instrument } from './instrument.model';
import { Person } from './person.model';

export type RehearsalPlaceDocument = HydratedDocument<RehearsalPlace>;

@Schema()
export class RehearsalPlace {
  @Prop()
  name: string;

  @Prop()
  address: string;
}

export const RehearsalPlaceSchema =
  SchemaFactory.createForClass(RehearsalPlace);
