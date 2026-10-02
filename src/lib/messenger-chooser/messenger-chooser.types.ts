/** Мессенджеры страницы выбора. MAX первым — так везде в продукте. */
export const CHOOSER_MESSENGER = {
  MAX: "max",
  TELEGRAM: "telegram",
} as const;

export type IChooserMessenger =
  (typeof CHOOSER_MESSENGER)[keyof typeof CHOOSER_MESSENGER];

export const CHOOSER_MESSENGERS: readonly IChooserMessenger[] = [
  CHOOSER_MESSENGER.MAX,
  CHOOSER_MESSENGER.TELEGRAM,
];

export const isChooserMessenger = (value: string): value is IChooserMessenger =>
  (CHOOSER_MESSENGERS as readonly string[]).includes(value);

/** Куда ведёт каждая кнопка. `null` — у заведения нет бота в этом мессенджере. */
export type IChooserTargets = Record<IChooserMessenger, string | null>;

/**
 * Сайт и приложение заведения — блок «Ещё у заведения» под мессенджерами
 * (план «Страница /go: сайт и приложение»). Значение — сегмент адреса
 * перехода `/go/<адрес>/<ресурс>`, то же, что ждёт main-server.
 */
export const CHOOSER_EXTRA = {
  SITE: "site",
  APP_IOS: "app-ios",
  APP_ANDROID: "app-android",
  APP_RUSTORE: "app-rustore",
} as const;

export type IChooserExtra = (typeof CHOOSER_EXTRA)[keyof typeof CHOOSER_EXTRA];

/** Порядок кнопок блока: сайт, затем магазины. */
export const CHOOSER_EXTRAS: readonly IChooserExtra[] = [
  CHOOSER_EXTRA.SITE,
  CHOOSER_EXTRA.APP_IOS,
  CHOOSER_EXTRA.APP_ANDROID,
  CHOOSER_EXTRA.APP_RUSTORE,
];

export const isChooserExtra = (value: string): value is IChooserExtra =>
  (CHOOSER_EXTRAS as readonly string[]).includes(value);

/** Ссылки блока «Ещё у заведения». `null` — кнопки нет. */
export type IChooserExtras = Record<IChooserExtra, string | null>;

export const EMPTY_CHOOSER_EXTRAS: IChooserExtras = {
  [CHOOSER_EXTRA.SITE]: null,
  [CHOOSER_EXTRA.APP_IOS]: null,
  [CHOOSER_EXTRA.APP_ANDROID]: null,
  [CHOOSER_EXTRA.APP_RUSTORE]: null,
};

/** Куда гость уходит со страницы: мессенджер или ресурс заведения. */
export type IChooserTarget = IChooserMessenger | IChooserExtra;

export const isChooserTarget = (value: string): value is IChooserTarget =>
  isChooserMessenger(value) || isChooserExtra(value);

/**
 * Для какого устройства кнопка: скрипт страницы прячет чужие магазины.
 * Без скрипта видны все кнопки.
 */
export const CHOOSER_PLATFORM = {
  ANY: "any",
  IOS: "ios",
  ANDROID: "android",
} as const;

export type IChooserPlatform =
  (typeof CHOOSER_PLATFORM)[keyof typeof CHOOSER_PLATFORM];

export const CHOOSER_EXTRA_PLATFORM: Record<IChooserExtra, IChooserPlatform> = {
  [CHOOSER_EXTRA.SITE]: CHOOSER_PLATFORM.ANY,
  [CHOOSER_EXTRA.APP_IOS]: CHOOSER_PLATFORM.IOS,
  [CHOOSER_EXTRA.APP_ANDROID]: CHOOSER_PLATFORM.ANDROID,
  [CHOOSER_EXTRA.APP_RUSTORE]: CHOOSER_PLATFORM.ANDROID,
};

/** Цели Метрики — только у собственной страницы Нямбота (демо). */
export type IChooserMetrika = {
  counterId: string;
  goals: Record<IChooserMessenger, string>;
};

export type IChooserPageParams = {
  /** Название заведения — заголовок страницы. */
  title: string;
  /** Ссылки кнопок: у клиентской страницы — наши счётчики переходов,
   *  у скачанного файла — прямые ссылки на ботов. */
  targets: IChooserTargets;
  /** Сайт и приложение заведения: у клиентской страницы — наши адреса
   *  перехода, у скачанного файла — прямые ссылки. Нет — блока нет. */
  extras?: IChooserExtras;
  /** Ссылка строки «Работает на Нямботе» внизу, с UTM-метками
   *  (`chooser-tracking.ts`). `null` — строки нет: в скачанном файле это
   *  страница клиента на его домене, она не должна зависеть от нас. */
  poweredByUrl: string | null;
  metrika?: IChooserMetrika;
  /** Метка скачанной страницы: по ней СРМ узнаёт «наш файл» на домене
   *  клиента. Значение — адрес ссылки. */
  fileMarker?: string;
  /** Лого заведения data-URI — вклеено в страницу, внешних ссылок нет
   *  (план «Брендирование», Ф4). */
  logo?: string | null;
  /** Ключ цветовой схемы бренда; `null` — страница в прежнем виде. */
  colorScheme?: string | null;
};
