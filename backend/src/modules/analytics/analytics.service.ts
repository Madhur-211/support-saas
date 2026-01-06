import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AnalyticsService {
  constructor(private sequelize: Sequelize) {}

  async getDashboardMetrics(schema: string) {
    // 1️⃣ Total tickets
    const [[{ count: totalTickets }]]: any = await this.sequelize.query(
      `SELECT COUNT(*)::int AS count FROM "${schema}".tickets;`,
    );

    // 2️⃣ Tickets by status
    const [statusBreakdown]: any = await this.sequelize.query(
      `
      SELECT status, COUNT(*)::int AS count
      FROM "${schema}".tickets
      GROUP BY status;
      `,
    );

    // 3️⃣ High priority tickets
    const [[{ count: highPriority }]]: any = await this.sequelize.query(
      `
      SELECT COUNT(*)::int AS count
      FROM "${schema}".tickets
      WHERE priority = 'high';
      `,
    );

    // 4️⃣ Tickets over time
    const [ticketsOverTime]: any = await this.sequelize.query(
      `
      SELECT DATE(created_at) AS date, COUNT(*)::int AS count
      FROM "${schema}".tickets
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at);
      `,
    );

    // 5️⃣ Closed tickets
    const [[{ count: closedTickets }]]: any = await this.sequelize.query(
      `
      SELECT COUNT(*)::int AS count
      FROM "${schema}".tickets
      WHERE status = 'closed';
      `,
    );

    const resolutionRate =
      totalTickets > 0 ? Math.round((closedTickets / totalTickets) * 100) : 0;

    return {
      totalTickets,
      highPriority,
      resolutionRate,
      statusBreakdown,
      ticketsOverTime,
    };
  }
}
