import { Injectable } from '@nestjs/common';
import * as textToSpeech from '@google-cloud/text-to-speech';
import * as crypto from 'crypto';
import { join } from 'path';
import { promises as fs } from 'fs';

const keyPath = process.env.TTS_FILE_DIRECTORY;
const publicTtsPath = join(__dirname, '..', 'public', 'tts');

@Injectable()
export class TtsService {
  private client: textToSpeech.TextToSpeechClient;

  constructor() {
    this.client = new textToSpeech.TextToSpeechClient({
      keyFilename: keyPath,
    });
  }

  generateFilename(text: string, lang: string): string {
    const hash = crypto
      .createHash('sha256')
      .update(`${text}-${lang}`)
      .digest('hex');
    return `${hash}.mp3`;
  }

  async synthesizeSpeechToFile(
    text: string,
    languageCode = 'es-ES'
  ): Promise<string> {
    const filename = this.generateFilename(text, languageCode);
    const filePath = join(publicTtsPath, filename);

    console.log('filePAth: ', filePath);
    console.log('publicTtsPath: ', publicTtsPath);
    // Ensure the directory exists
    await fs.mkdir(publicTtsPath, { recursive: true });

    console.log(`${process.env.API_URL}/public/tts/${filename}`);
    // If the file already exists, return the URL
    try {
      await fs.access(filePath);
      return `${process.env.API_URL}/public/tts/${filename}`;
    } catch {
      // Continue to generate audio
    }

    const request: textToSpeech.protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest =
      {
        input: { text },
        voice: { languageCode, ssmlGender: 'FEMALE' },
        audioConfig: { audioEncoding: 'MP3' },
      };

    const [response] = await this.client.synthesizeSpeech(request);
    await fs.writeFile(filePath, response.audioContent as Uint8Array);

    return `${process.env.API_URL}/public/tts/${filename}`;
  }
}
