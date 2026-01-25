import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { CustomerNotesService } from './customer-notes.service';
import { CreateCustomerNoteDto } from './dto/create-customer-note.dto';
import { UpdateCustomerNoteDto } from './dto/update-customer-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('customer-notes')
export class CustomerNotesController {
  constructor(private readonly customerNotesService: CustomerNotesService) {}

  @Post(':customerId')
  @UseGuards(JwtAuthGuard)
  createNote(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Body() dto: CreateCustomerNoteDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.customerNotesService.create(
      customerId,
      req.user.sub,
      dto,
      req.user,
    );
  }

  @Get()
  findAll() {
    return this.customerNotesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerNotesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerNoteDto: UpdateCustomerNoteDto,
  ) {
    return this.customerNotesService.update(+id, updateCustomerNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerNotesService.remove(+id);
  }
}
