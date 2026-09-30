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
  /** Строка «Работает на Нямботе» внизу. В скачанном файле её нет: это
   *  страница клиента на его домене, она не должна зависеть от нас. */
  poweredBy: boolean;
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
