export interface ServiceTemplateDto {
  _id: string | null;
  name: string;
  description: string;
  instruments: TemplateInstrumentConfig[];
}

export interface TemplateInstrumentConfig {
  id: string;
  instrument: string;
  members: number;
}
