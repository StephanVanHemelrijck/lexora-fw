import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { OpenAIChatResponse } from './interfaces/OpenAIChatResponse.interface';

@Injectable()
export class GptService {
  private readonly OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  async getGptResponse(
    messages: { role: string; content: string }[],
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
        },
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
  cleanGptJsonResponse(response: string): string {
    let cleaned = response.trim();

    // Remove ```json and ``` if they exist
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.substring(7);
    }
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.substring(3);
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.substring(0, cleaned.length - 3);
    }

    // Final trim again
    return cleaned.trim();
  }
}
