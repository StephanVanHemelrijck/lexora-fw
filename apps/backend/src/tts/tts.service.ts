import { Injectable } from '@nestjs/common';
import * as textToSpeech from '@google-cloud/text-to-speech';
import * as crypto from 'crypto';
import { join } from 'path';
import { promises as fs } from 'fs';

const keyPath = process.env.TTS_FILE_DIRECTORY;
const publicTtsPath = join(__dirname, '..', 'public', 'tts');

// Preferred voices per language
const VOICE_MAP: Record<string, { languageCode: string; name: string }> = {
  en: { languageCode: 'en-US', name: 'en-US-Wavenet-F' },
  es: { languageCode: 'es-ES', name: 'es-ES-Wavenet-A' },
  fr: { languageCode: 'fr-FR', name: 'fr-FR-Wavenet-D' },
  de: { languageCode: 'de-DE', name: 'de-DE-Wavenet-F' },
  it: { languageCode: 'it-IT', name: 'it-IT-Wavenet-C' },
  pt: { languageCode: 'pt-PT', name: 'pt-PT-Wavenet-A' },
  zh: { languageCode: 'cmn-CN', name: 'cmn-CN-Wavenet-A' },
  ja: { languageCode: 'ja-JP', name: 'ja-JP-Wavenet-B' },
  ko: { languageCode: 'ko-KR', name: 'ko-KR-Wavenet-B' },
  ar: { languageCode: 'ar-XA', name: 'ar-XA-Wavenet-A' },
};

// Fallback voice
const FALLBACK_VOICE = {
  languageCode: 'en-US',
  name: 'en-US-Wavenet-F',
};

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

  async synthesizeSpeechToFile(text: string, lang: string): Promise<string> {
    const voiceConfig = VOICE_MAP[lang] ?? FALLBACK_VOICE;

    const filename = this.generateFilename(text, lang);
    const filePath = join(publicTtsPath, filename);

    // Ensure output directory exists
    await fs.mkdir(publicTtsPath, { recursive: true });

    // Return cached audio if already exists
    try {
      await fs.access(filePath);
      return `${process.env.API_URL}/public/tts/${filename}`;
    } catch {
      // Continue to synthesize
    }

    const request: textToSpeech.protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest =
      {
        input: { text },
        voice: {
          languageCode: voiceConfig.languageCode,
          ssmlGender: 'FEMALE',
        },
        audioConfig: { audioEncoding: 'MP3' },
      };

    const [response] = await this.client.synthesizeSpeech(request);
    await fs.writeFile(filePath, response.audioContent as Uint8Array);

    return `${process.env.API_URL}/public/tts/${filename}`;
  }
}
