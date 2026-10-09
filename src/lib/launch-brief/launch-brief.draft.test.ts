import { afterEach, describe, expect, it, vi } from "vitest";
import {
  BRIEF_FIELD,
  BRIEF_ONLINE_PAYMENT,
  BRIEF_POS,
  createEmptyBriefState,
  isRecord,
  type LaunchBriefFormState,
} from "./launch-brief.model";
import {
  BRIEF_DRAFT,
  clearBriefDraft,
  getBriefDraftStorage,
  readBriefDraft,
  writeBriefDraft,
  type BriefDraftStorage,
} from "./launch-brief.draft";

/**
 * Черновик заявки на запуск в `localStorage` (Р23): переживает закрытие
 * вкладки, не мешает форме, когда хранилище недоступно (приватное окно,
 * запрет сайтам, полная квота), и не хранит галочку согласия.
 */

const memoryStorage = () => {
  const data = new Map<string, string>();
  const storage: BriefDraftStorage = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
    removeItem: (key) => {
      data.delete(key);
    },
  };
  return { data, storage };
};

/** Хранилище, которое бросает на любое обращение, — как в приватном окне Safari. */
const brokenStorage: BriefDraftStorage = {
  getItem: () => {
    throw new Error("SecurityError");
  },
  setItem: () => {
    throw new Error("QuotaExceededError");
  },
  removeItem: () => {
    throw new Error("SecurityError");
  },
};

const filledState = (): LaunchBriefFormState => {
  const state = createEmptyBriefState();
  state.texts.venue = "Ромашка";
  state.texts.comment = "Ждём к выходным";
  state.texts.outletsTotal = "2–5";
  state.choices.pos = BRIEF_POS.RKEEPER;
  state.choices.onlinePayment = BRIEF_ONLINE_PAYMENT.YOOKASSA;
  return state;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("черновик заявки", () => {
  it("записанное читается обратно целиком", () => {
    const { storage } = memoryStorage();
    const state = filledState();
    writeBriefDraft(storage, state, 1_000);
    expect(readBriefDraft(storage, 2_000)).toEqual(state);
  });

  it("в черновике только ответы — без галочки согласия", () => {
    const { data, storage } = memoryStorage();
    writeBriefDraft(storage, filledState(), 1_000);
    const saved: unknown = JSON.parse(data.get(BRIEF_DRAFT.KEY) ?? "null");
    expect(saved).toMatchObject({
      version: BRIEF_DRAFT.VERSION,
      savedAt: 1_000,
    });
    const savedState = isRecord(saved) ? saved.state : null;
    expect(
      isRecord(savedState) ? Object.keys(savedState).sort() : null,
    ).toEqual(["choices", "texts"]);
  });

  it("пустая форма — черновик стирается, а не пишется", () => {
    const { data, storage } = memoryStorage();
    writeBriefDraft(storage, filledState(), 1_000);
    writeBriefDraft(storage, createEmptyBriefState(), 2_000);
    expect(data.has(BRIEF_DRAFT.KEY)).toBe(false);
    expect(readBriefDraft(storage)).toBeNull();
  });

  it("после отправки черновик стирается", () => {
    const { data, storage } = memoryStorage();
    writeBriefDraft(storage, filledState(), 1_000);
    clearBriefDraft(storage);
    expect(data.has(BRIEF_DRAFT.KEY)).toBe(false);
  });

  it("старше 30 дней — не читается и стирается", () => {
    const { data, storage } = memoryStorage();
    writeBriefDraft(storage, filledState(), 1_000);
    expect(readBriefDraft(storage, 1_000 + BRIEF_DRAFT.TTL_MS + 1)).toBeNull();
    expect(data.has(BRIEF_DRAFT.KEY)).toBe(false);
  });

  it("чужая версия и битый JSON — нет черновика, без исключения", () => {
    const { data, storage } = memoryStorage();
    data.set(
      BRIEF_DRAFT.KEY,
      JSON.stringify({
        version: BRIEF_DRAFT.VERSION + 1,
        savedAt: 1_000,
        state: filledState(),
      }),
    );
    expect(readBriefDraft(storage, 2_000)).toBeNull();

    data.set(BRIEF_DRAFT.KEY, "{не json");
    expect(readBriefDraft(storage, 2_000)).toBeNull();
  });

  it("подменённые значения отбрасываются, известные — остаются", () => {
    const { data, storage } = memoryStorage();
    data.set(
      BRIEF_DRAFT.KEY,
      JSON.stringify({
        version: BRIEF_DRAFT.VERSION,
        savedAt: 1_000,
        state: {
          texts: { venue: "Ромашка", name: 42, injected: "x" },
          choices: { pos: "HACK", onlinePayment: "NONE" },
        },
      }),
    );
    const draft = readBriefDraft(storage, 2_000);
    expect(draft?.texts.venue).toBe("Ромашка");
    expect(draft?.texts.name).toBe("");
    expect(draft && "injected" in draft.texts).toBe(false);
    expect(draft?.choices.pos).toBeNull();
    expect(draft?.choices[BRIEF_FIELD.ONLINE_PAYMENT]).toBe(
      BRIEF_ONLINE_PAYMENT.NONE,
    );
  });

  it("черновик прежней длинной формы читается: поля короткой — на месте, лишнее отброшено", () => {
    const { data, storage } = memoryStorage();
    data.set(
      BRIEF_DRAFT.KEY,
      JSON.stringify({
        version: BRIEF_DRAFT.VERSION,
        savedAt: 1_000,
        state: {
          texts: {
            venue: "Ромашка",
            name: "Анна",
            telegram: "@romashka_cafe",
            outletsTotal: "3",
            city: "Казань",
            notifyPhone: "+7 900 000-00-00",
            outletsAtLaunch: "1",
            menuUrl: "eda.yandex.ru/r/romashka",
            inn: "7707083893",
          },
          choices: {
            pos: "IIKO",
            onlinePayment: "YOOKASSA",
            notifyMessenger: "MAX",
            iikoOwner: "OWNER",
            loyalty: "NONE",
            legalForm: "IP",
          },
          flags: { have: ["APP"], couriers: ["OWN"] },
        },
      }),
    );
    const expected = createEmptyBriefState();
    expected.texts.venue = "Ромашка";
    expected.texts.name = "Анна";
    expected.texts.telegram = "@romashka_cafe";
    expected.texts.outletsTotal = "3";
    expected.choices.pos = BRIEF_POS.IIKO;
    expected.choices.onlinePayment = BRIEF_ONLINE_PAYMENT.YOOKASSA;
    expect(readBriefDraft(storage, 2_000)).toEqual(expected);
  });

  it("в черновике длинной формы не было ничего из короткой — черновика нет", () => {
    const { data, storage } = memoryStorage();
    data.set(
      BRIEF_DRAFT.KEY,
      JSON.stringify({
        version: BRIEF_DRAFT.VERSION,
        savedAt: 1_000,
        state: {
          texts: { city: "Казань", inn: "7707083893" },
          choices: { loyalty: "NONE" },
          flags: { have: ["APP"] },
        },
      }),
    );
    expect(readBriefDraft(storage, 2_000)).toBeNull();
  });
});

describe("хранилище недоступно — форма работает без черновика", () => {
  it("нет хранилища: чтение — пусто, запись и стирание — молча", () => {
    expect(readBriefDraft(null)).toBeNull();
    expect(() => writeBriefDraft(null, filledState())).not.toThrow();
    expect(() => clearBriefDraft(null)).not.toThrow();
  });

  it("хранилище бросает на каждое обращение — ни одного исключения наружу", () => {
    expect(readBriefDraft(brokenStorage)).toBeNull();
    expect(() => writeBriefDraft(brokenStorage, filledState())).not.toThrow();
    expect(() =>
      writeBriefDraft(brokenStorage, createEmptyBriefState()),
    ).not.toThrow();
    expect(() => clearBriefDraft(brokenStorage)).not.toThrow();
  });

  it("на сервере (нет window) хранилища нет", () => {
    expect(getBriefDraftStorage()).toBeNull();
  });

  it("само обращение к localStorage бросает — хранилища нет", () => {
    vi.stubGlobal("window", {
      get localStorage(): Storage {
        throw new Error("SecurityError");
      },
    });
    expect(getBriefDraftStorage()).toBeNull();
  });
});
