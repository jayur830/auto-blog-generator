import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JsModule } from './modules/js/js.module';
import { ConfigModule } from '@nestjs/config';
import { OpenAIModule } from './modules/openai/openai.module';

@Module({
  imports: [ConfigModule.forRoot(), JsModule, OpenAIModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
