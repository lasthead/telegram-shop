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
import { ProductsModule } from './catalog/products/products.module';
import { ProductsController } from './catalog/products/products.controller';
import { ProductsService } from './catalog/products/products.service';
import { SizesModule } from './catalog/sizes/sizes.module';
import {Product} from "./catalog/products/products.model";
import {Size} from "./catalog/sizes/sizes.model";
import {ProductSizes} from "./catalog/products/product-sizes.model";
import {SizesService} from "./catalog/sizes/sizes.service";
import {CollectionsModule} from "./catalog/collections/collections.module";

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
        models: [User, Brand, Collection, Product, Size, ProductSizes],
        autoLoadModels: true,
      }),
      SequelizeModule.forFeature([User, Brand, Collection, Product, Size, ProductSizes]),
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
      UsersModule,
      BrandsModule,
      CollectionsModule,
      ProductsModule,
      SizesModule,
  ],
  controllers: [ProductsController],
  providers: [
    AppService,
    AppUpdate,
    UsersService,
    BrandsService,
    CollectionsService,
    AppButtons,
    ProductsService,
    SizesService,
  ],
})
export class AppModule {}
