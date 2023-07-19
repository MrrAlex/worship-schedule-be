import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Person, PersonDocument } from '../../models';
import { Model } from 'mongoose';
import { ServiceTemplateDto } from '../../../dto';
import { PersonDto } from '../../../dto/person.dto';
import { InstrumentService } from '../instrument/instrument.service';

@Injectable()
export class PeopleService {
  constructor(
    @InjectModel(Person.name)
    private person: Model<PersonDocument>,
    private instrumentService: InstrumentService,
  ) {}

  async create(dto: PersonDto) {
    const person = new Person();
    person.name = dto.name;
    person.instruments = await this.instrumentService.getInstrumentsByIds(
      dto.instruments,
    );
    return this.person.create(person);
  }

  async delete(id: string) {
    await this.person.findByIdAndDelete(id);
  }

  async update(id: string, dto: PersonDto) {
    const found = await this.person.findById(id);
    found.name = dto.name;
    found.instruments = await this.instrumentService.getInstrumentsByIds(
      dto.instruments,
    );
    await found.save();
    return found;
  }

  findAll() {
    return this.person.find();
  }

  async findOne(id: string): Promise<ServiceTemplateDto> {
    return this.person.findById(id);
  }
}
