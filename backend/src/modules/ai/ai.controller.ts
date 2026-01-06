import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AiService } from './ai.service';
import { AiReplyDto } from './dto/ai-reply.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('suggest-reply')
  async suggestReply(@Body() dto: AiReplyDto) {
    return this.aiService.suggestReply(dto.ticketTitle, dto.ticketDescription);
  }
}
