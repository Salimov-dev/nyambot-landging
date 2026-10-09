import { describe, expect, it } from "vitest";
import {
  BRIEF_LIMIT,
  BRIEF_ONLINE_PAYMENT,
  BRIEF_POS,
  createEmptyBriefState,
  type LaunchBriefFormState,
} from "./launch-brief.model";
import {
  buildBriefRequestPayload,
  pickLaunchBriefPayload,
  readLeadReply,
  readMainServerReply,
  toBriefAnswers,
} from "./launch-brief.payload";

/**
 * Тело заявки на запуск (план `brif-zapuska-2026-10-09`, Ф2): что собирает
 * браузер и что пропускает прокси лендинга. Список полей — короткая форма
 * (решение 10.10) и схема main-server `launchBriefAnswersSchema`.
 */

/**
 * Ответы короткой формы — ровно они и уходят на main-server. Город сервер
 * принимает, но форма его не спрашивает и не шлёт.
 */
const ANSWER_FIELDS = [
  "venue",
  "site",
  "name",
  "phone",
  "telegram",
  "max",
  "email",
  "outletsTotal",
  "pos",
  "onlinePayment",
  "comment",
];

/** Служебные поля от браузера; `startedAt` — только когда известно. */
const META_FIELDS = ["consent", "page", "website2"];

const META = {
  consent: true,
  page: "https://nyambot.ru/zapusk",
  startedAt: 1_000,
  website2: "",
};

/** Заполненная короткая форма — все поля. */
const filled = (): LaunchBriefFormState => {
  const state = createEmptyBriefState();
  state.texts.name = " Анна ";
  state.texts.email = "anna@mail.ru";
  state.texts.telegram = "@romashka_cafe";
  state.texts.venue = "  Ромашка ";
  state.texts.site = "romashka.ru";
  state.texts.outletsTotal = "3";
  state.texts.comment = "Ждём к выходным";
  state.choices.pos = BRIEF_POS.IIKO;
  state.choices.onlinePayment = BRIEF_ONLINE_PAYMENT.YOOKASSA;
  return state;
};

/** Ответы прежней длинной формы — сервер их уже не принимает. */
const LONG_FORM_LEFTOVERS = {
  city: "Казань",
  notifyPhone: "+7 900 000-00-00",
  notifyMessenger: "MAX",
  promoCode: "START",
  outletsAtLaunch: 1,
  addresses: "Ленина, 1",
  menuUrl: "eda.yandex.ru/r/romashka",
  iikoOwner: "OWNER",
  deliveryKinds: ["COURIER"],
  loyalty: "NONE",
  legalForm: "IP",
  inn: "7707083893",
  have: ["APP"],
};

describe("toBriefAnswers — ответы из формы", () => {
  it("строки обрезаны, число точек — числом", () => {
    const answers = toBriefAnswers(filled());
    expect(answers.venue).toBe("Ромашка");
    expect(answers.name).toBe("Анна");
    expect(answers.outletsTotal).toBe(3);
    expect(answers.pos).toBe(BRIEF_POS.IIKO);
    expect(answers.onlinePayment).toBe(BRIEF_ONLINE_PAYMENT.YOOKASSA);
  });

  it("диапазон точек «2–5» — верхняя граница, пусто — «не ответил»", () => {
    const state = filled();
    state.texts.outletsTotal = "2–5";
    expect(toBriefAnswers(state).outletsTotal).toBe(5);
    state.texts.outletsTotal = "";
    expect(toBriefAnswers(state).outletsTotal).toBeNull();
  });
});

describe("buildBriefRequestPayload — что отправляет браузер", () => {
  it("только поля короткой формы и служебные; время открытия — если известно", () => {
    const payload = buildBriefRequestPayload(filled(), META);
    expect(Object.keys(payload).sort()).toEqual(
      [...ANSWER_FIELDS, ...META_FIELDS, "startedAt"].sort(),
    );
    expect(payload.consent).toBe(true);
    expect(payload.startedAt).toBe(1_000);

    const withoutTime = buildBriefRequestPayload(filled(), {
      ...META,
      startedAt: null,
    });
    expect("startedAt" in withoutTime).toBe(false);
  });

  it("страница — не длиннее предела", () => {
    const payload = buildBriefRequestPayload(filled(), {
      ...META,
      page: `https://nyambot.ru/zapusk?${"a".repeat(BRIEF_LIMIT.PAGE)}`,
    });
    expect(payload.page).toHaveLength(BRIEF_LIMIT.PAGE);
  });
});

describe("pickLaunchBriefPayload — белый список прокси", () => {
  it("лишние поля браузера отбрасываются — и чужие, и длинной формы, и адрес с метками", () => {
    const payload = pickLaunchBriefPayload({
      venue: "Ромашка",
      ...LONG_FORM_LEFTOVERS,
      isAdmin: true,
      visitorIp: "1.2.3.4",
      utm: { source: "spoof" },
    });
    expect(Object.keys(payload).sort()).toEqual(
      [...ANSWER_FIELDS, ...META_FIELDS].sort(),
    );
    expect(payload.venue).toBe("Ромашка");
  });

  it("варианты — только значения enum main-server", () => {
    const payload = pickLaunchBriefPayload({
      pos: "iiko",
      onlinePayment: BRIEF_ONLINE_PAYMENT.YOOKASSA,
    });
    expect(payload.pos).toBeNull();
    expect(payload.onlinePayment).toBe(BRIEF_ONLINE_PAYMENT.YOOKASSA);
    expect(pickLaunchBriefPayload({ onlinePayment: 42 }).onlinePayment).toBe(
      null,
    );
  });

  it("число точек — целое от 1 до 1000, иначе «не ответил»", () => {
    expect(pickLaunchBriefPayload({ outletsTotal: 5 }).outletsTotal).toBe(5);
    for (const bad of ["5", 0, 1.5, 1_001, null]) {
      expect(pickLaunchBriefPayload({ outletsTotal: bad }).outletsTotal).toBe(
        null,
      );
    }
  });

  it("строки — не длиннее пределов main-server, не строки — пустые", () => {
    const payload = pickLaunchBriefPayload({
      comment: "а".repeat(BRIEF_LIMIT.LONG_TEXT + 50),
      site: "s".repeat(BRIEF_LIMIT.URL + 1),
      venue: "К".repeat(BRIEF_LIMIT.SHORT_TEXT + 1),
      name: 123,
    });
    expect(payload.comment).toHaveLength(BRIEF_LIMIT.LONG_TEXT);
    expect(payload.site).toHaveLength(BRIEF_LIMIT.URL);
    expect(payload.venue).toHaveLength(BRIEF_LIMIT.SHORT_TEXT);
    expect(payload.name).toBe("");
  });

  it("согласие — только настоящее true, время — только число", () => {
    const payload = pickLaunchBriefPayload({
      consent: "true",
      startedAt: "1000",
    });
    expect(payload.consent).toBe(false);
    expect("startedAt" in payload).toBe(false);
    expect(
      pickLaunchBriefPayload({ consent: true, startedAt: 1_000 }),
    ).toMatchObject({ consent: true, startedAt: 1_000 });
  });

  it("ловушка `website2` проходит как есть — её проверяет main-server", () => {
    expect(pickLaunchBriefPayload({ website2: "spam" }).website2).toBe("spam");
  });

  it("не объект — пустая заявка, а не исключение", () => {
    for (const raw of [null, "venue", 42, ["venue"]]) {
      const payload = pickLaunchBriefPayload(raw);
      expect(payload.venue).toBe("");
      expect(payload.pos).toBeNull();
      expect(payload.outletsTotal).toBeNull();
      expect(payload.consent).toBe(false);
    }
  });

  it("собранное браузером проходит белый список без потерь", () => {
    const sent = buildBriefRequestPayload(filled(), META);
    expect(pickLaunchBriefPayload(JSON.parse(JSON.stringify(sent)))).toEqual(
      sent,
    );
  });
});

describe("разбор ответов", () => {
  it("конверт main-server", () => {
    expect(readMainServerReply({ success: true, data: {} })).toEqual({
      success: true,
      error: null,
    });
    expect(
      readMainServerReply({ success: false, error: "invalid_site" }),
    ).toEqual({ success: false, error: "invalid_site" });
    expect(readMainServerReply("<html>")).toEqual({
      success: false,
      error: null,
    });
  });

  it("ответ прокси браузеру", () => {
    expect(readLeadReply({ ok: true })).toEqual({ ok: true, error: null });
    expect(readLeadReply({ ok: false, error: "rate_limited" })).toEqual({
      ok: false,
      error: "rate_limited",
    });
    expect(readLeadReply(null)).toEqual({ ok: false, error: null });
  });
});
