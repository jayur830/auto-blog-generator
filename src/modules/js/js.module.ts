import { Module } from '@nestjs/common';
import { JsController } from './js.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { OpenAIModule } from '../openai/openai.module';
import { OpenAIService } from '../openai/openai.service';

@Module({
  imports: [HttpModule, OpenAIModule],
  controllers: [JsController],
  providers: [ConfigService, OpenAIService],
})
export class JsModule {}
