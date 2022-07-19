import {Logger} from '@nestjs/common';
import {Action, InjectBot, Start, Update} from "nestjs-telegraf";
import {Context, Telegraf} from "telegraf";
import {AppButtons} from "./app.buttons";
import {I18nService} from "nestjs-i18n";
// import {UsersService} from "./users/users.service";
import {BrandsService} from "./catalog/brands/brands.service";
import {CollectionsService} from "./catalog/collections/collections.service";
// import {SizesService} from "./catalog/sizes/sizes.service";
// import {CreateSizeDto} from "./catalog/sizes/dto/create-size.dto";
// import {ProductsService} from "./catalog/products/products.service";

@Update ()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly i18n: I18nService,
    // private readonly userService: UsersService,
    private readonly brandService: BrandsService,
    private readonly collectionService: CollectionsService,
    private readonly appButtons: AppButtons,
    // private sizeService: SizesService,
    // private productService: ProductsService,
  ) {}

  private readonly logger = new Logger(AppUpdate.name);


  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply(this.i18n.t('dict.start_description'), this.appButtons.actionButtons())
  }

  @Action("start")
  async backToStart(ctx: Context) {
    return await this.getStartMenu(ctx)
  }

  @Action("catalog")
  async getCatalog(ctx) {
      const brands = await this.brandService.getAllBrands()
      await this.replyData(
        ctx,
        this.i18n.t("dict.choose_brand"),
        this.appButtons.buttonsList(brands, "start", "brand")
      )
  }

  @Action(/^brand-(\d+)$/)
  async getBrandCollections(ctx) {
    const brand = await this.brandService.getBrandCollections(ctx.match[1])
    await this.replyData(
      ctx,
      this.i18n.t("dict.brand_description", {args: { brand: brand.name }}),
      this.appButtons.buttonsList(brand.collection, "catalog", ctx.match[1])
    )
  }

  @Action("search")
  async getSearch(ctx) {
    const chat_id = ctx.update.callback_query.message.chat.id
    const message_id = ctx.update.callback_query.message.message_id
    await ctx.editMessageText(this.i18n.t("dict.search_description"), this.appButtons.searchButtons(), [chat_id, message_id])
  }

  @Action("search-cancel")
  async cancelSearch(ctx) {
    return await this.getStartMenu(ctx)
  }

  async getStartMenu(ctx) {
    return await this.replyData(ctx, this.i18n.t("dict.start_description"), this.appButtons.actionButtons())
  }

  async replyData(ctx, description?, content?) {
    const chat_id = ctx.update.callback_query.message.chat.id
    const message_id = ctx.update.callback_query.message.message_id

    try {
      await ctx.editMessageText(description, {
          reply_markup: content.reply_markup,
          chat_id,
          message_id,
          parse_mode: 'HTML'
        })
    }
     catch (e) {
      this.logger.error(e)
    }
  }

}
