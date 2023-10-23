import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RehearsalPlace } from './rehersal-place.model';

export type RehearsalDocument = HydratedDocument<Rehearsal>;

@Schema()
export class Rehearsal {
  @Prop()
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'RehearsalPlace' })
  place: RehearsalPlace | Types.ObjectId;
}

export const RehearsalSchema = SchemaFactory.createForClass(Rehearsal);
