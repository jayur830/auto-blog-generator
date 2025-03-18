import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [OpenAIService, ConfigService],
})
export class OpenAIModule {}
