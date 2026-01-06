import { IsNotEmpty } from 'class-validator';

export class AiReplyDto {
  @IsNotEmpty()
  ticketTitle: string;

  @IsNotEmpty()
  ticketDescription: string;
}
