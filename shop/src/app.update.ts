import {Logger} from '@nestjs/common';
import {Action, InjectBot, Start, Update} from "nestjs-telegraf";
import {Context, Telegraf} from "telegraf";
import {actionButtons, searchButtons} from "./app.buttons";
import {I18nService} from "nestjs-i18n";

@Update ()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    readonly i18n: I18nService) {}
    private readonly logger = new Logger(AppUpdate.name);

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply(this.i18n.t('dict.start_description'), actionButtons(this.i18n))
  }

  @Action("catalog")
  async getCatalog(ctx) {
    return await this.getStartMenu(ctx)
  }

  @Action("search")
  async getSearch(ctx) {
    const chat_id = ctx.update.callback_query.message.chat.id
    const message_id = ctx.update.callback_query.message.message_id
    await ctx.editMessageText(this.i18n.t("dict.search_description"), searchButtons(this.i18n), [chat_id, message_id])
  }

  @Action("search-cancel")
  async cancelSearch(ctx) {
    return await this.getStartMenu(ctx)
  }

  async getStartMenu(ctx) {
    const chat_id = ctx.update.callback_query.message.chat.id
    const message_id = ctx.update.callback_query.message.message_id
    try {
      await ctx.editMessageText(this.i18n.t("dict.start_description"), actionButtons(this.i18n), [chat_id, message_id])
    } catch (e) {
      this.logger.error("start-menu is already open")
    }
  }

  async catalogMenu() {

  }
}
