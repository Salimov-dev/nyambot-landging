import {
  resolveColorScheme,
  toStoredColorScheme,
} from "@/shared/brand-rules/brand-rules.shared";
import { escapeHtml } from "./html-escape";
import {
  CHOOSER_BUTTON_TEXT,
  CHOOSER_EXTRA_BUTTON_TEXT,
  CHOOSER_TEXT,
} from "./messenger-chooser.text";
import {
  CHOOSER_EXTRA_PLATFORM,
  CHOOSER_EXTRAS,
  CHOOSER_MESSENGER,
  CHOOSER_MESSENGERS,
  CHOOSER_PLATFORM,
  type IChooserExtra,
  type IChooserMessenger,
  type IChooserMetrika,
  type IChooserPageParams,
} from "./messenger-chooser.types";

/**
 * Страница «Открыть в MAX / Открыть в Телеграм» — куда ведёт общий QR-код.
 * Под мессенджерами — выгоды заказа в чате и, если ресторатор их указал,
 * блок «Ещё у заведения»: сайт и приложение (план «Страница /go: сайт и
 * приложение»). Мессенджеры всегда выше и крупнее.
 *
 * 🔴 Голый HTML строкой, а не страница Next: корневой layout лендинга вешает
 * на всё Метрику Нямбота и кнопку связи с НАШЕЙ поддержкой. Гостю заведения ни
 * то, ни другое показывать нельзя — это чужой визит и чужой бренд. Второй
 * повод: тот же HTML скачивается из СРМ файлом и живёт на домене клиента без
 * нас, поэтому в нём нет ни одной внешней зависимости — стили и скрипт внутри.
 */

/** Имя метки скачанного файла — то же читает проверка домена в main-server. */
const FILE_MARKER_META = "nyambot-qr";

/** Класс `<body>` страницы бренда с выбранной схемой. */
const BRANDED_BODY_CLASS = "branded";

/** Ключ последнего выбора гостя — только в его браузере. */
const LAST_CHOICE_STORAGE_KEY = "nyambot_chooser_last";

/** Значки кнопок. Кольцо MAX — вырез (evenodd), а не закрашенный круг:
 *  сквозь него видна подложка кнопки, а не чужой цвет. */
const ICONS: Record<IChooserMessenger, string> = {
  [CHOOSER_MESSENGER.MAX]: `<svg width="28" height="28" viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="12" fill="#fff" fill-opacity=".18"/><path fill-rule="evenodd" d="M24 10C16.3 10 10 16.3 10 24c0 3.5 1.3 6.7 3.5 9.1L12 38l5.2-1.4c2.2 1.2 4.4 1.9 6.8 1.9 7.7 0 14-6.3 14-14.3C38 16.3 31.7 10 24 10Zm0 7a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z" fill="#fff"/></svg>`,
  [CHOOSER_MESSENGER.TELEGRAM]: `<svg width="28" height="28" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#fff" fill-opacity=".18"/><path d="M34.9 13.4 30.4 35.2c-.3 1.3-1.1 1.6-2.2 1l-6.5-4.8-3.1 3c-.4.4-.7.7-1.4.7l.5-6.7 11.9-10.7c.5-.4-.1-.7-.8-.3L14 26.7l-6.3-2c-1.3-.4-1.4-1.3.2-2l25.2-10c1.1-.4 2.1.3 1.8.7Z" fill="#fff"/></svg>`,
};

const STYLES = `
:root{--bg:#f6f6f9;--card:#fff;--text:#16161d;--muted:#6b6b78;--border:rgba(0,0,0,.08);--outline:rgba(0,0,0,.18)}
@media (prefers-color-scheme:dark){:root{--bg:#0f0f14;--card:#1a1a22;--text:#f4f4f7;--muted:#a0a0ad;--border:rgba(255,255,255,.08);--outline:rgba(255,255,255,.22)}}
[hidden]{display:none!important}
*{box-sizing:border-box;margin:0;padding:0}
html,body{min-height:100%}
body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;display:flex;align-items:center;justify-content:center;padding:24px 16px;min-height:100vh}
.card{width:100%;max-width:400px;background:var(--card);border:1px solid var(--border);border-radius:20px;padding:32px 24px;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,.06)}
h1{font-size:24px;line-height:1.25;font-weight:700;word-wrap:break-word;text-wrap:balance}
.lead{margin-top:8px;color:var(--muted);font-size:16px;line-height:1.4;text-wrap:balance}
.buttons{display:flex;flex-direction:column;gap:12px;margin-top:24px}
.btn{position:relative;display:flex;align-items:center;justify-content:center;gap:12px;min-height:60px;padding:14px 20px;border-radius:14px;color:#fff;font-size:18px;font-weight:600;text-decoration:none;transition:transform .1s ease,filter .15s ease}
.btn:active{transform:scale(.98)}
.btn:hover{filter:brightness(1.06)}
.btn-max{background:linear-gradient(135deg,#5b8def,#7b5ce5 50%,#9b4ed8)}
.btn-telegram{background:#229ed9}
.badge{position:absolute;top:-9px;right:12px;padding:2px 8px;border-radius:999px;background:var(--text);color:var(--card);font-size:12px;font-weight:600;display:none}
.btn.is-last .badge{display:inline-block}
.extras{margin-top:24px}
.extras-title{display:flex;align-items:center;gap:12px;color:var(--muted);font-size:13px}
.extras-title::before,.extras-title::after{content:"";flex:1;height:1px;background:var(--border)}
.extras .buttons{margin-top:12px;gap:10px}
.btn-extra{min-height:48px;padding:10px 16px;color:var(--text);background:transparent;border:1px solid var(--outline);font-size:16px}
.btn-extra:hover{filter:none;border-color:var(--muted)}
.note{margin-top:20px;color:var(--muted);font-size:14px;line-height:1.45;text-wrap:pretty}
.powered{display:inline-block;margin-top:24px;color:var(--muted);font-size:12px;text-decoration:none}
.powered:hover{text-decoration:underline}
.brand{color:#ff8c00;font-weight:600}
.logo{display:block;width:88px;height:88px;margin:0 auto 16px;border-radius:50%;object-fit:cover;background:var(--card);border:1px solid var(--border)}
body.branded{background:radial-gradient(120% 60% at 50% 0%,rgba(var(--accent-rgb),.22),transparent 60%),var(--bg)}
.branded .card{border-top:4px solid var(--accent)}
.branded .btn-extra:hover{border-color:var(--accent)}
.branded .logo{border:none;box-shadow:0 0 0 3px var(--accent),0 8px 24px rgba(var(--accent-rgb),.28)}
`.trim();

/** Только вклеенная растровая картинка — никакой внешней ссылки в файле клиента. */
const LOGO_DATA_URI = /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/;

/**
 * Акцент бренда (план «Брендирование», Ф4) — лёгкий: свечение фона, полоска
 * над карточкой, кольцо лого. Кнопки MAX и Телеграм остаются в своих цветах
 * (Р7), слово «Нямбот» — в цвете Нямбота. Схемы нет — страница прежняя.
 */
const renderBrandStyle = (colorScheme: string | null | undefined): string => {
  if (!toStoredColorScheme(colorScheme)) return "";
  const { palette } = resolveColorScheme(colorScheme);
  return `<style>:root{--accent:${palette.accent};--accent-rgb:${palette.accentRgb}}</style>`;
};

const renderLogo = (logo: string | null | undefined): string =>
  logo && LOGO_DATA_URI.test(logo)
    ? `<img class="logo" src="${logo}" alt="">`
    : "";

const availableMessengers = (params: IChooserPageParams): IChooserMessenger[] =>
  CHOOSER_MESSENGERS.filter((messenger) => Boolean(params.targets[messenger]));

const renderButton = (messenger: IChooserMessenger, href: string): string =>
  `<a class="btn btn-${messenger}" href="${escapeHtml(href)}" data-messenger="${messenger}">${ICONS[messenger]}<span>${escapeHtml(CHOOSER_BUTTON_TEXT[messenger])}</span><span class="badge">${escapeHtml(CHOOSER_TEXT.lastChoice)}</span></a>`;

const availableExtras = (params: IChooserPageParams): IChooserExtra[] =>
  CHOOSER_EXTRAS.filter((extra) => Boolean(params.extras?.[extra]));

/** Второстепенная кнопка: контур, цвет текста страницы, ниже мессенджеров. */
const renderExtraButton = (extra: IChooserExtra, href: string): string =>
  `<a class="btn btn-extra" href="${escapeHtml(href)}" data-extra="${extra}" data-platform="${CHOOSER_EXTRA_PLATFORM[extra]}" target="_blank" rel="noopener">${escapeHtml(CHOOSER_EXTRA_BUTTON_TEXT[extra])}</a>`;

const renderExtras = (
  extras: IChooserExtra[],
  params: IChooserPageParams,
): string =>
  extras.length === 0
    ? ""
    : `<section class="extras"><p class="extras-title">${escapeHtml(CHOOSER_TEXT.extrasTitle)}</p><div class="buttons">${extras
        .map((extra) => renderExtraButton(extra, params.extras?.[extra] ?? ""))
        .join("")}</div></section>`;

const renderMetrikaInit = (metrika: IChooserMetrika): string => {
  const id = JSON.stringify(metrika.counterId);
  return `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(Number(${id}),"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true});`;
};

/**
 * Скрипт страницы: пометить прошлый выбор гостя и запомнить новый. Хранилище
 * может быть закрыто (приватный режим, встроенный браузер) — тогда страница
 * просто работает без пометки.
 *
 * Магазины — по устройству: iPhone и iPad (в том числе iPad, назвавшийся
 * компьютером Mac) видят App Store, Android — Google Play и RuStore, остальные
 * — всё. Не осталось ни одной кнопки — прячем и заголовок блока.
 */
const renderScript = (metrika: IChooserMetrika | undefined): string => {
  const goals = metrika ? JSON.stringify(metrika.goals) : "null";
  const counterId = metrika ? JSON.stringify(metrika.counterId) : "null";
  const key = JSON.stringify(LAST_CHOICE_STORAGE_KEY);

  const platform = `(function(){var ua=navigator.userAgent||"",ios=/iPhone|iPad|iPod/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1),android=/Android/.test(ua),hide=ios?${JSON.stringify(CHOOSER_PLATFORM.ANDROID)}:android?${JSON.stringify(CHOOSER_PLATFORM.IOS)}:null;if(!hide)return;var extras=document.querySelectorAll("[data-platform]"),visible=0;for(var i=0;i<extras.length;i++){if(extras[i].getAttribute("data-platform")===hide){extras[i].hidden=true}else{visible++}}if(!visible){var block=document.querySelector(".extras");if(block)block.hidden=true}})();`;

  return `${platform}(function(){var key=${key},goals=${goals},counterId=${counterId};var last=null;try{last=localStorage.getItem(key)}catch(e){}var buttons=document.querySelectorAll("[data-messenger]");for(var i=0;i<buttons.length;i++){(function(button){var messenger=button.getAttribute("data-messenger");if(buttons.length>1&&messenger===last){button.className+=" is-last"}button.addEventListener("click",function(){try{localStorage.setItem(key,messenger)}catch(e){}if(goals&&counterId&&window.ym){window.ym(Number(counterId),"reachGoal",goals[messenger])}})})(buttons[i])}})();`;
};

const renderDocument = (
  title: string,
  body: string,
  head = "",
  script = "",
  bodyClass = "",
): string =>
  `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${escapeHtml(title)}</title>${head}<style>${STYLES}</style></head><body${bodyClass ? ` class="${bodyClass}"` : ""}>${body}${script ? `<script>${script}</script>` : ""}</body></html>`;

/**
 * Страница выбора мессенджера. С одной кнопкой и без сайта и приложения —
 * сразу уводит в мессенджер; есть что ещё показать — показывает страницу (Р4).
 */
export const renderChooserPage = (params: IChooserPageParams): string => {
  const messengers = availableMessengers(params);
  const extras = availableExtras(params);
  const single =
    messengers.length === 1 && extras.length === 0 ? messengers[0] : null;
  const singleHref = single ? params.targets[single] : null;

  const buttons = messengers
    .map((messenger) =>
      renderButton(messenger, params.targets[messenger] ?? ""),
    )
    .join("");

  const lead = single
    ? `${escapeHtml(CHOOSER_TEXT.single)}<br>${escapeHtml(CHOOSER_TEXT.singleFallback)}`
    : escapeHtml(CHOOSER_TEXT.lead);

  const pitch = single
    ? ""
    : `<p class="note">${escapeHtml(
        messengers.length > 1
          ? CHOOSER_TEXT.pitchBothMessengers
          : CHOOSER_TEXT.pitchOneMessenger,
      )}</p>`;

  const powered = params.poweredByUrl
    ? `<a class="powered" href="${escapeHtml(params.poweredByUrl)}" target="_blank" rel="noopener">${escapeHtml(CHOOSER_TEXT.poweredByPrefix)} <span class="brand">${escapeHtml(CHOOSER_TEXT.poweredByBrand)}</span></a>`
    : "";

  const body = `<main class="card">${renderLogo(params.logo)}<h1>${escapeHtml(params.title)}</h1><p class="lead">${lead}</p><div class="buttons">${buttons}</div>${pitch}${renderExtras(extras, params)}${powered}</main>`;

  const head = [
    params.fileMarker
      ? `<meta name="${FILE_MARKER_META}" content="${escapeHtml(params.fileMarker)}">`
      : "",
    singleHref
      ? `<meta http-equiv="refresh" content="0;url=${escapeHtml(singleHref)}">`
      : "",
    params.metrika
      ? `<script>${renderMetrikaInit(params.metrika)}</script>`
      : "",
    renderBrandStyle(params.colorScheme),
  ].join("");

  return renderDocument(
    params.title,
    body,
    head,
    renderScript(params.metrika),
    toStoredColorScheme(params.colorScheme) ? BRANDED_BODY_CLASS : "",
  );
};

/** Кнопка под текстом страницы-сообщения. */
export type IChooserMessageAction = { href: string; label: string };

/**
 * Ответ вместо страницы выбора: ссылка не найдена, сервер недоступен или
 * заглушка ресурса демо. Кнопка — по желанию.
 */
export const renderChooserMessagePage = (
  title: string,
  text: string,
  action?: IChooserMessageAction,
): string =>
  renderDocument(
    title,
    `<main class="card"><h1>${escapeHtml(title)}</h1><p class="lead">${escapeHtml(text)}</p>${
      action
        ? `<div class="buttons"><a class="btn btn-extra" href="${escapeHtml(action.href)}">${escapeHtml(action.label)}</a></div>`
        : ""
    }</main>`,
  );
