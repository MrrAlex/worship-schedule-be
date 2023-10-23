import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
