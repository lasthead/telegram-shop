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
import { BrandsModule } from "./catalog/brands/brands.module";
import {User} from "./users/users.model";
import {UsersService} from "./users/users.service";
import {Brand} from "./catalog/brands/brands.model";
import {BrandsService} from "./catalog/brands/brands.service";
import {AppButtons} from "./app.buttons";
import {CollectionsService} from "./catalog/collections/collections.service";
import {Collection} from "./catalog/collections/collections.model";

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
        models: [User, Brand, Collection],
        autoLoadModels: true,
      }),
      SequelizeModule.forFeature([User, Brand, Collection]),
      I18nModule.forRoot({
          fallbackLanguage: 'ru',
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
  providers: [AppService, AppUpdate, UsersService, BrandsService, CollectionsService, AppButtons],
})
export class AppModule {}
