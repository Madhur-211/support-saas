import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateTicketDto) {
    return this.ticketsService.createTicket(req.user.schema, dto);
  }

  @Get()
  findAll(@Req() req) {
    return this.ticketsService.getAllTickets(req.user.schema);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.ticketsService.getTicketById(req.user.schema, Number(id));
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.ticketsService.updateTicket(req.user.schema, Number(id), dto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.ticketsService.deleteTicket(req.user.schema, Number(id));
  }
}
