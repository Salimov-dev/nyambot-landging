import { LINKS } from "@/config/links.config";
import {
  CHOOSER_EXTRA,
  CHOOSER_EXTRAS,
  type IChooserExtra,
  type IChooserExtras,
} from "./messenger-chooser.types";

/**
 * Сайт и приложение на демо-странице «Кусочка» (`/demo`).
 *
 * Демо заменяет презентацию: интересант сканирует наш QR-код и должен увидеть
 * блок «Ещё у заведения» так же, как у заведения с сайтом и приложением. Своих
 * сайта и приложения у «Кусочка» нет, поэтому кнопки ведут на заглушку
 * `/demo/<ресурс>`: она объясняет, куда кнопка ведёт у настоящего заведения.
 *
 * Через СРМ так не сделать: проверка ссылок не пускает наш домен ни в сайт,
 * ни в магазины приложений (`qr-link-extra-url.util.ts` main-server; план
 * «Страница /go: сайт и приложение», 03.10.2026).
 */

export const demoExtraPath = (extra: IChooserExtra): string =>
  `${LINKS.demo.chooser}/${extra}`;

/** Все кнопки блока ведут на заглушки; магазины скрипт страницы делит по устройству. */
export const DEMO_EXTRAS: IChooserExtras = Object.fromEntries(
  CHOOSER_EXTRAS.map((extra) => [extra, demoExtraPath(extra)]),
) as IChooserExtras;

/** Какой ресурс показывает заглушка: сайт или приложение. */
const DEMO_EXTRA_KIND = {
  SITE: "site",
  APP: "app",
} as const;

type IDemoExtraKind = (typeof DEMO_EXTRA_KIND)[keyof typeof DEMO_EXTRA_KIND];

const DEMO_EXTRA_KIND_BY_EXTRA: Record<IChooserExtra, IDemoExtraKind> = {
  [CHOOSER_EXTRA.SITE]: DEMO_EXTRA_KIND.SITE,
  [CHOOSER_EXTRA.APP_IOS]: DEMO_EXTRA_KIND.APP,
  [CHOOSER_EXTRA.APP_ANDROID]: DEMO_EXTRA_KIND.APP,
  [CHOOSER_EXTRA.APP_RUSTORE]: DEMO_EXTRA_KIND.APP,
};

/**
 * Тексты заглушки. Читает интересант (ресторатор на показе), а не гость
 * заведения, поэтому про «твоё заведение» и про счётчики переходов.
 */
const DEMO_EXTRA_TEXT: Record<IDemoExtraKind, { title: string; text: string }> =
  {
    [DEMO_EXTRA_KIND.SITE]: {
      title: "Здесь будет сайт заведения",
      text: "У демо-кафе «Кусочек» сайта нет. У твоего заведения эта кнопка откроет твой сайт: гость сканирует один QR-код и сам выбирает MAX, Телеграм, сайт или приложение, а ты видишь в СРМ, сколько гостей ушло в каждый канал.",
    },
    [DEMO_EXTRA_KIND.APP]: {
      title: "Здесь будет приложение заведения",
      text: "У демо-кафе «Кусочек» своего приложения нет. У твоего заведения эта кнопка откроет его в App Store, Google Play или RuStore — телефон гостя видит только свой магазин. QR-код при этом один на всё, а в СРМ видно, сколько гостей ушло в каждый канал.",
    },
  };

export const DEMO_EXTRA_ACTION = {
  href: LINKS.pages.qrCode,
  label: "Как работает один QR-код",
} as const;

export const demoExtraText = (
  extra: IChooserExtra,
): { title: string; text: string } =>
  DEMO_EXTRA_TEXT[DEMO_EXTRA_KIND_BY_EXTRA[extra]];
