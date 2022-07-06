import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import { AppService } from './app.service';
import {Telegraf} from "telegraf";
import {TelegrafModule} from "nestjs-telegraf";
import * as LocalSession from "telegraf-session-local"
import * as path from 'path';
import { AcceptLanguageResolver,
    I18nJsonLoader,
    I18nModule,
    QueryResolver, } from 'nestjs-i18n';

const { BOT_TOKEN } = require("./config")


const session = new LocalSession({ database: "session_db.json" })

@Module({
  imports: [
      TelegrafModule.forRoot({
        middlewares: [ session.middleware() ],
        token: BOT_TOKEN
      }),
      I18nModule.forRoot({
          fallbackLanguage: 'ru',
          formatter: (template: string, ...args: any[]) => template,
          loaderOptions: {
              path: path.join(__dirname, '/i18n/'),
              watch: true,
          },
          resolvers: [
              { use: QueryResolver, options: ['lang'] },
              AcceptLanguageResolver,
          ],
      }),
  ],
  controllers: [],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
