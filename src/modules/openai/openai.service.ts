import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { RequestOptions } from 'openai/core';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({ apiKey: configService.get('OPENAI_API_KEY') });
  }

  create(
    body: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
    options?: RequestOptions,
  ) {
    return this.openai.chat.completions.create(body, options);
  }
}
