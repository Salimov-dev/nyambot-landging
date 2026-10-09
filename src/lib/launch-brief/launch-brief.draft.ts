/**
 * Черновик заявки на запуск — в браузере, не у нас (Р23).
 *
 * Закрыл вкладку — и лид потерян (Руслан 09.10.2026). Поэтому
 * каждое изменение пишется в `localStorage`, а при возврате на `/zapusk` форма
 * продолжает с того же места. До отправки на сервер не уходит ничего: без
 * галочки согласия хранить персональные данные у себя нельзя.
 *
 * - Галочка согласия в черновик не попадает: согласие даётся при отправке,
 *   а не впрок.
 * - Чтение и запись — в `try/catch`: в приватном окне, при запрете
 *   хранилища или полной квоте форма работает без черновика.
 * - Черновик старше 30 дней стирается — чужие данные в браузере не копим.
 */
import {
  isBriefEmpty,
  isRecord,
  sanitizeBriefFormState,
  type LaunchBriefFormState,
} from "./launch-brief.model";

export const BRIEF_DRAFT = {
  KEY: "nyambot:launch-brief-draft",
  /**
   * Меняется, когда старый черновик уже не прочитать, — тогда его стираем.
   * Переход на короткую форму (10.10) версию не менял: черновик длинной формы
   * читается, лишние ответы и флажки отбрасывает `sanitizeBriefFormState`.
   */
  VERSION: 1,
  TTL_MS: 30 * 24 * 60 * 60 * 1000,
} as const;

/** Что нужно от хранилища — `localStorage` или подмена в тестах. */
export type BriefDraftStorage = Pick<
  Storage,
  "getItem" | "setItem" | "removeItem"
>;

/**
 * `localStorage`, если он есть. Само обращение к нему бросает исключение,
 * когда браузер запретил хранилище сайтам, — тогда черновика нет.
 */
export const getBriefDraftStorage = (): BriefDraftStorage | null => {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
};

export const clearBriefDraft = (storage: BriefDraftStorage | null): void => {
  if (!storage) return;
  try {
    storage.removeItem(BRIEF_DRAFT.KEY);
  } catch {
    // Хранилище недоступно — стирать нечего.
  }
};

/** Сохранённый черновик или `null`: нет, битый, устарел или пустой. */
export const readBriefDraft = (
  storage: BriefDraftStorage | null,
  now: number = Date.now(),
): LaunchBriefFormState | null => {
  if (!storage) return null;
  try {
    const raw = storage.getItem(BRIEF_DRAFT.KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    const draft: Record<string, unknown> = isRecord(parsed) ? parsed : {};
    const savedAt = draft.savedAt;
    if (
      draft.version !== BRIEF_DRAFT.VERSION ||
      typeof savedAt !== "number" ||
      now - savedAt > BRIEF_DRAFT.TTL_MS
    ) {
      clearBriefDraft(storage);
      return null;
    }
    const state = sanitizeBriefFormState(draft.state);
    return state && !isBriefEmpty(state) ? state : null;
  } catch {
    return null;
  }
};

/** Записать черновик; пустую форму — стереть. */
export const writeBriefDraft = (
  storage: BriefDraftStorage | null,
  state: LaunchBriefFormState,
  now: number = Date.now(),
): void => {
  if (!storage) return;
  if (isBriefEmpty(state)) {
    clearBriefDraft(storage);
    return;
  }
  try {
    storage.setItem(
      BRIEF_DRAFT.KEY,
      JSON.stringify({ version: BRIEF_DRAFT.VERSION, savedAt: now, state }),
    );
  } catch {
    // Приватное окно или полная квота — форма работает без черновика.
  }
};
