import { HydratedDocument, Types } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Instrument } from './instrument.model';

export type PersonDocument = HydratedDocument<Person>;

@Schema()
export class Person {
  @Prop()
  name: string;

  @Prop([{ type: Types.ObjectId, ref: 'Instrument' }])
  instruments: Instrument[];
}

export const PersonSchema = SchemaFactory.createForClass(Person);
