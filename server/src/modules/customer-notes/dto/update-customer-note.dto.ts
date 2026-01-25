import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerNoteDto } from './create-customer-note.dto';

export class UpdateCustomerNoteDto extends PartialType(CreateCustomerNoteDto) {}
