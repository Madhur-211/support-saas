import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async suggestReply(ticketTitle: string, ticketDescription: string) {
    try {
      const prompt = `
You are a professional customer support agent.

Write a polite, clear, and helpful reply for the following support ticket.

Ticket Title:
${ticketTitle}

Ticket Description:
${ticketDescription}

Response:
`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.4,
      });

      return {
        reply: completion.choices[0].message.content,
      };
    } catch (error: any) {
      console.error('AI error:', error?.error || error);

      // 🔹 Handle quota / billing errors gracefully
      if (error?.status === 429 || error?.code === 'insufficient_quota') {
        return {
          reply:
            'Thanks for reaching out. Our support team is reviewing your issue and will get back to you shortly.',
          note: 'AI quota exceeded – fallback response used',
        };
      }

      throw new InternalServerErrorException('Failed to generate AI response');
    }
  }
}
