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
    const trimmed = raw.trim();

    // If wrapped in a Markdown-style ```json block, extract inside
    const markdownMatch = trimmed.match(/```json\s*([\s\S]*?)\s*```/i);
    if (markdownMatch) return markdownMatch[1].trim();

    // If starts with [ or {, assume it's plain JSON
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) return trimmed;

    throw new Error('No valid JSON objects found');
  }
}
