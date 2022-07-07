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
import {SequelizeModule} from "@nestjs/sequelize";
import { UsersModule } from './users/users.module';

const session = new LocalSession({ database: "session_db.json" })

@Module({
  imports: [
      ConfigModule.forRoot({
        envFilePath: `../.${process.env.NODE_ENV}.env`
      }),
      TelegrafModule.forRoot({
        middlewares: [ session.middleware() ],
        token: process.env.BOT_TOKEN
      }),
      SequelizeModule.forRoot({
        dialect: 'mysql',
        host: process.env.HOSTNAME,
        port: Number(process.env.PORT),
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        models: [],
        autoLoadModels: true,
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
      UsersModule,
  ],
  controllers: [],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
