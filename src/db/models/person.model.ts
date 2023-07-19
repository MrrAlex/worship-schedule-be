import { HydratedDocument } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PersonDocument = HydratedDocument<Person>;

@Schema()
export class Person {
  @Prop()
  name: string;

  @Prop(
    raw({
      instrument: { type: String },
      isPlayingInstrument: { type: Boolean },
    }),
  )
  config: Record<string, boolean>;
}

export const PersonSchema = SchemaFactory.createForClass(Person);
