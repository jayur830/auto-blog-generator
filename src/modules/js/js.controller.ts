import { HttpService } from '@nestjs/axios';
import { Controller, Get } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { parseStringPromise } from 'xml2js';
import { OpenAIService } from '../openai/openai.service';
import { writeFile } from 'fs';

const RSS_URL = 'https://cprss.s3.amazonaws.com/javascriptweekly.com.xml';

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

@Controller('js')
export class JsController {
  constructor(
    private readonly httpService: HttpService,
    private readonly openAiService: OpenAIService,
  ) {}

  @Get('/test')
  async test() {
    const result = await this.openAiService.create({
      model: 'gpt-4o-search-preview',
      web_search_options: {},
      messages: [
        {
          role: 'user',
          content:
            'https://computer-science-student.tistory.com/736\n\n이 페이지의 내용을 요약하라.',
        },
      ],
    });
    console.log('결과:', result.choices);
    console.log('사용량:', result.usage);

    return true;
  }

  @Get()
  async analyze() {
    // RSS XML 데이터 요청
    const response = await lastValueFrom(this.httpService.get(RSS_URL));
    const xmlData = response.data;

    // XML을 JSON으로 변환
    const jsonData: {
      rss: {
        $: { version: '2.0' };
        channel: {
          title: string;
          description: string;
          link: string;
          item: {
            title: string;
            link: string;
            description: string[];
            pubDate: string;
            guid: string;
          }[];
        };
      };
    } = await parseStringPromise(xmlData, {
      explicitArray: false,
    });

    // writeFile(
    //   './rss.json',
    //   JSON.stringify(jsonData, null, 2),
    //   'utf8',
    //   () => {},
    // );
    if (jsonData.rss.channel.item.length > 0) {
      const { link } = jsonData.rss.channel.item[0];

      const result = await this.openAiService.create({
        model: 'gpt-4o-search-preview',
        web_search_options: {},
        messages: [
          {
            role: 'user',
            content: `${link}

Choose three useful URLs for frontend developers from the provided link and list them, each on a new line. Do not include any additional explanations.`,
          },
        ],
      });
      console.log('사용량:', result.usage);
      const urls = (result.choices[0].message.content || '')
        .split('\n')
        .filter((l) => l)
        .map((l) => l.trim());

      for (let i = 0; i < urls.length; i++) {
        const blogResult = await this.openAiService.create({
          model: 'gpt-4o-search-preview',
          web_search_options: {},
          messages: [
            {
              role: 'user',
              content: `${urls[i]}
        
Please write a Markdown blog post in Korean based on the above article. Provide the output entirely in Markdown format from start to finish.`,
            },
          ],
        });
        console.log('사용량:', blogResult.usage);
        writeFile(
          `.${i}.md`,
          blogResult.choices[0].message.content || '',
          'utf8',
          () => {},
        );
      }
    }

    return 'js';
  }
}
