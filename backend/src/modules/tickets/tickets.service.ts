import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class TicketsService {
  constructor(private sequelize: Sequelize) {}

  async createTicket(schema: string, data: any) {
    const [result] = await this.sequelize.query(
      `
      INSERT INTO "${schema}".tickets (title, description, status, priority)
      VALUES (:title, :description, 'open', :priority)
      RETURNING *;
      `,
      {
        replacements: {
          title: data.title,
          description: data.description,
          priority: data.priority || 'medium',
        },
      },
    );

    return (result as any[])[0];
  }

  async getAllTickets(schema: string) {
    const [result] = await this.sequelize.query(
      `SELECT * FROM "${schema}".tickets ORDER BY created_at DESC;`,
    );

    return result;
  }

  async getTicketById(schema: string, id: number) {
    const [result] = await this.sequelize.query(
      `SELECT * FROM "${schema}".tickets WHERE id = :id;`,
      {
        replacements: { id },
      },
    );

    return (result as any[])[0];
  }

  async updateTicket(schema: string, id: number, data: any) {
    const [result] = await this.sequelize.query(
      `
    UPDATE "${schema}".tickets
    SET
      status = COALESCE(:status, status),
      priority = COALESCE(:priority, priority)
    WHERE id = :id
    RETURNING *;
    `,
      {
        replacements: {
          id,
          status: data.status ?? null,
          priority: data.priority ?? null,
        },
      },
    );

    return (result as any[])[0];
  }

  async deleteTicket(schema: string, id: number) {
    await this.sequelize.query(
      `DELETE FROM "${schema}".tickets WHERE id = :id;`,
      {
        replacements: { id },
      },
    );

    return { message: 'Ticket deleted' };
  }
}
