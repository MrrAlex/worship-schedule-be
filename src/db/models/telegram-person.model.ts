import { HydratedDocument, Types } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Instrument } from './instrument.model';
import { Person } from './person.model';

export type TelegramPersonDocument = HydratedDocument<TelegramPerson>;

@Schema()
export class TelegramPerson {
  @Prop()
  chatId: number;

  @Prop({ type: Types.ObjectId, ref: 'Person' })
  person: Person | Types.ObjectId;
}

export const TelegramPersonSchema =
  SchemaFactory.createForClass(TelegramPerson);
