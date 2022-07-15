import {Markup} from "telegraf";
import {I18nService} from "nestjs-i18n";
import {Injectable} from "@nestjs/common";

@Injectable()
export class AppButtons {
  constructor(
    private readonly i18n: I18nService,
  ) {}

  public actionButtons() {
    return Markup.inlineKeyboard([
        Markup.button.callback(this.i18n.t("dict.buttons.start.catalog"), "catalog"),
        Markup.button.callback(this.i18n.t("dict.buttons.start.search"), "search"),
        Markup.button.callback(this.i18n.t("dict.buttons.start.info"), "info"),
        Markup.button.callback(this.i18n.t("dict.buttons.start.help"), "help"),
        Markup.button.callback(this.i18n.t("dict.buttons.start.orders"), "orders"),
      ],
      { columns: 2 }
    )
  }

  public searchButtons() {
    return Markup.inlineKeyboard([
        Markup.button.callback(this.i18n.t("dict.buttons.search.by_article"), "search-article"),
        Markup.button.callback(this.i18n.t("dict.buttons.search.by_size"), "search-size"),
        Markup.button.callback(this.i18n.t("dict.buttons.common.cancel"), "search-cancel"),
      ],
      { columns: 1 }
    )
  }

  public buttonsList(list, cancelAction?, prefix?, showCounter?) {
    return Markup.inlineKeyboard([
        ...list.map(item => {
          return Markup.button.callback(item.name, prefix + "-" + item.id)
        }),
        Markup.button.callback(this.i18n.t("dict.buttons.common.back"), cancelAction),
      ],
      { columns: 1 }
    )
  }
}