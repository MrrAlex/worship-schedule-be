import { PersonDto } from './person.dto';

export interface ServiceDtoWithLeader extends ServiceDto {
  leader: PersonDto;
}

export interface ServiceDtoWithLeaderId extends ServiceDto {
  leader: string;
}

export interface ServiceDto {
  _id: string | null;
  name: string;
  leader: string | PersonDto;
  date: string;
  isForSend: boolean;
  instruments: ServiceInstrumentConfig[];
}

export interface ServiceInstrumentConfig {
  instrument: string;
  people: string[];
}
