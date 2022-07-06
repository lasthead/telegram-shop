import {Markup} from "telegraf";
import {I18nService} from "nestjs-i18n";

export function actionButtons(i18n) {
  return Markup.inlineKeyboard([
      Markup.button.callback(i18n.t("dict.buttons.start.catalog"), "catalog"),
      Markup.button.callback(i18n.t("dict.buttons.start.search"), "search"),
      Markup.button.callback(i18n.t("dict.buttons.start.info"), "info"),
      Markup.button.callback(i18n.t("dict.buttons.start.help"), "help"),
      Markup.button.callback(i18n.t("dict.buttons.start.orders"), "orders"),
    ],
    { columns: 2 }
  )
}

export function searchButtons(i18n) {
  return Markup.inlineKeyboard([
      Markup.button.callback(i18n.t("dict.buttons.search.by_article"), "search-article"),
      Markup.button.callback(i18n.t("dict.buttons.search.by_size"), "search-size"),
      Markup.button.callback(i18n.t("dict.buttons.common.cancel"), "search-cancel"),
    ],
    { columns: 1 }
  )
}