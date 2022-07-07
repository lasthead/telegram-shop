import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import { AppService } from './app.service';
import {TelegrafModule} from "nestjs-telegraf";
import * as LocalSession from "telegraf-session-local"
import * as path from 'path';
import { AcceptLanguageResolver,
    I18nModule,
    QueryResolver, } from 'nestjs-i18n';
import {ConfigModule} from "@nestjs/config";

const session = new LocalSession({ database: "session_db.json" })

@Module({
  imports: [
      ConfigModule.forRoot({
        envFilePath: "../.env"
      }),
      TelegrafModule.forRoot({
        middlewares: [ session.middleware() ],
        token: process.env.BOT_TOKEN
      }),
      I18nModule.forRoot({
          fallbackLanguage: 'ru',
          formatter: (template: string) => template,
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
