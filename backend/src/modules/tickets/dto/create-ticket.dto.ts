import { IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  priority?: string;
}
