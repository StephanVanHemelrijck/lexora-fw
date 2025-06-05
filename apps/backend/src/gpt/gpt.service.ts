import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { OpenAIChatResponse } from './interfaces/OpenAIChatResponse.interface';

@Injectable()
export class GptService {
  private readonly OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  async getGptResponse(
    messages: { role: string; content: string }[]
  ): Promise<string> {
    try {
      const response: AxiosResponse<OpenAIChatResponse> = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: messages,
          temperature: 0.5,
        },
        {
          headers: {
            Authorization: `Bearer ${this.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const reply = response.data.choices[0].message.content;
      return reply;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Clean GPT response and extract valid JSON content.
   * Strips markdown wrapping like ```json and trims whitespace.
   */
  cleanGptJsonResponse(raw: string): string {
    // Remove anything before the first {
    const cleaned = raw.trim().replace(/^.*?({)/s, '$1');

    // Match all top-level JSON objects
    const jsonObjects = cleaned.match(/{[^{}]*}(?=\s*{|\s*$)/gs);

    if (!jsonObjects) {
      throw new Error('No valid JSON objects found');
    }

    // Join them into a JSON array string
    return `[${jsonObjects.join(',')}]`;
  }
}
