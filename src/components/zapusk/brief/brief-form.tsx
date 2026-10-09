"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import {
  BRIEF_ERROR_TARGET,
  BRIEF_FIELD_ERROR,
  BRIEF_FORM_TEXT,
  BRIEF_MISSING_TEXT,
  LEAD_API,
  type BriefErrorTarget,
} from "@/config/zapusk-page.config";
import {
  clearBriefDraft,
  getBriefDraftStorage,
  readBriefDraft,
  writeBriefDraft,
  type BriefDraftStorage,
} from "@/lib/launch-brief/launch-brief.draft";
import {
  BRIEF_ERROR,
  BRIEF_FIELD,
  BRIEF_FORM_PART,
  createEmptyBriefState,
  enumValueOf,
  type BriefChoiceField,
  type BriefChoices,
  type BriefTextInputField,
  type LaunchBriefFormState,
} from "@/lib/launch-brief/launch-brief.model";
import {
  BRIEF_PAYLOAD_META,
  buildBriefRequestPayload,
  readLeadReply,
} from "@/lib/launch-brief/launch-brief.payload";
import {
  BRIEF_MISSING,
  formatErrorOf,
  missingOf,
  type BriefMissing,
} from "@/lib/launch-brief/launch-brief.validation";
import {
  FieldError,
  briefTargetId,
  revealBriefTarget,
  type BriefFormApi,
} from "./brief-controls";
import { SectionQuick } from "./section-quick";
import styles from "./brief.module.css";

const STATUS = {
  IDLE: "idle",
  SENDING: "sending",
  ERROR: "error",
  RATE_LIMITED: "rateLimited",
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS];

type ShownError = { target: BriefErrorTarget; text: string };

/** Какие ошибки снимает правка поля: исправил номер — ошибка под ним ушла. */
const TARGETS_OF_FIELD: Partial<
  Record<BriefTextInputField, readonly BriefErrorTarget[]>
> = {
  [BRIEF_FIELD.NAME]: [BRIEF_ERROR_TARGET.NAME],
  [BRIEF_FIELD.PHONE]: [BRIEF_ERROR_TARGET.PHONE, BRIEF_ERROR_TARGET.CONTACT],
  [BRIEF_FIELD.TELEGRAM]: [
    BRIEF_ERROR_TARGET.TELEGRAM,
    BRIEF_ERROR_TARGET.CONTACT,
  ],
  [BRIEF_FIELD.MAX]: [BRIEF_ERROR_TARGET.MAX, BRIEF_ERROR_TARGET.CONTACT],
  [BRIEF_FIELD.VENUE]: [BRIEF_ERROR_TARGET.VENUE],
  [BRIEF_FIELD.OUTLETS_TOTAL]: [BRIEF_ERROR_TARGET.OUTLETS],
  [BRIEF_FIELD.SITE]: [BRIEF_ERROR_TARGET.SITE],
  [BRIEF_FIELD.EMAIL]: [BRIEF_ERROR_TARGET.EMAIL],
};

/** Где показать «не хватает» — под тем полем, которое пустое. */
const MISSING_TARGET: Record<BriefMissing, BriefErrorTarget> = {
  [BRIEF_MISSING.NAME]: BRIEF_ERROR_TARGET.NAME,
  [BRIEF_MISSING.CONTACT]: BRIEF_ERROR_TARGET.CONTACT,
  [BRIEF_MISSING.VENUE]: BRIEF_ERROR_TARGET.VENUE,
  [BRIEF_MISSING.POS]: BRIEF_ERROR_TARGET.POS,
  [BRIEF_MISSING.CONSENT]: BRIEF_ERROR_TARGET.CONSENT,
};

/** Ошибка, которую показываем под полем, — по коду проверки или сервера. */
const fieldErrorOf = (code: string | null): ShownError | null => {
  const known = enumValueOf(BRIEF_ERROR, code);
  return known ? (BRIEF_FIELD_ERROR[known] ?? null) : null;
};

/**
 * Заявка на запуск — одна короткая форма в одну колонку (Руслан 10.10:
 * «основное узнаем, детали выясним в диалоге»). Остальные поля заявки
 * оператор заполняет сам после звонка, в карточке админки.
 *
 * Кнопка активна всегда: пустое обязательное поле подсвечивается под ним при
 * нажатии. Черновик — в `localStorage` (Р23), до отправки на сервер не уходит
 * ничего. Защита от ботов — ловушка `website2` и время открытия формы. Цель
 * Метрики `lead_form` — только после «принято» (🔴 имя не меняем, Р15).
 */
export function BriefForm({ onSuccess }: { onSuccess: () => void }) {
  const [state, setState] = useState<LaunchBriefFormState>(
    createEmptyBriefState,
  );
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState<Status>(STATUS.IDLE);
  const [shownError, setShownError] = useState<ShownError | null>(null);
  const [restored, setRestored] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const startedAt = useRef<number | null>(null);
  const storage = useRef<BriefDraftStorage | null>(null);

  // Черновик читаем после гидратации: на сервере браузерного хранилища нет,
  // и разметка до и после должна совпасть.
  useEffect(() => {
    startedAt.current = Date.now();
    storage.current = getBriefDraftStorage();
    const draft = readBriefDraft(storage.current);
    if (draft) {
      setState(draft);
      setRestored(true);
    }
    setDraftLoaded(true);
  }, []);

  useEffect(() => {
    if (draftLoaded) writeBriefDraft(storage.current, state);
  }, [state, draftLoaded]);

  const isSending = status === STATUS.SENDING;

  const resetFailure = () => {
    if (status === STATUS.ERROR || status === STATUS.RATE_LIMITED) {
      setStatus(STATUS.IDLE);
    }
  };

  const dismissError = (targets: readonly BriefErrorTarget[]) => {
    setShownError((prev) =>
      prev && targets.includes(prev.target) ? null : prev,
    );
  };

  const showError = (error: ShownError) => {
    setShownError(error);
    revealBriefTarget(error.target);
  };

  const api: BriefFormApi = {
    state,
    disabled: isSending,
    setText: (field, value) => {
      setState((prev) => ({
        ...prev,
        texts: { ...prev.texts, [field]: value },
      }));
      dismissError(TARGETS_OF_FIELD[field] ?? []);
      resetFailure();
    },
    setChoice: <TField extends BriefChoiceField>(
      field: TField,
      value: BriefChoices[TField],
    ) => {
      setState((prev) => ({
        ...prev,
        choices: { ...prev.choices, [field]: value },
      }));
      if (field === BRIEF_FIELD.POS) dismissError([BRIEF_ERROR_TARGET.POS]);
      resetFailure();
    },
    errorFor: (target) =>
      shownError?.target === target ? shownError.text : null,
  };

  /** «Начать заново»: стереть черновик и всё, что введено. */
  const startOver = () => {
    clearBriefDraft(storage.current);
    setState(createEmptyBriefState());
    setConsent(false);
    setShownError(null);
    setRestored(false);
    setStatus(STATUS.IDLE);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSending) return;

    const missing = missingOf(state, consent);
    if (missing) {
      showError({
        target: MISSING_TARGET[missing],
        text: BRIEF_MISSING_TEXT[missing],
      });
      return;
    }

    const invalid = fieldErrorOf(formatErrorOf(state));
    if (invalid) {
      showError(invalid);
      return;
    }

    setStatus(STATUS.SENDING);
    setShownError(null);

    const body = new FormData();
    body.append(
      BRIEF_FORM_PART.PAYLOAD,
      JSON.stringify(
        buildBriefRequestPayload(state, {
          consent,
          page: window.location.href,
          startedAt: startedAt.current,
          website2: trap,
        }),
      ),
    );

    try {
      const response = await fetch(LEAD_API.LANDING_ROUTE, {
        method: "POST",
        body,
      });
      const reply = readLeadReply(await response.json().catch(() => null));

      if (response.ok && reply.ok) {
        clearBriefDraft(storage.current);
        reachGoal("lead_form");
        onSuccess();
        return;
      }

      if (reply.error === BRIEF_ERROR.RATE_LIMITED) {
        setStatus(STATUS.RATE_LIMITED);
        return;
      }
      const byField = fieldErrorOf(reply.error);
      if (byField) {
        setStatus(STATUS.IDLE);
        showError(byField);
        return;
      }
      setStatus(STATUS.ERROR);
    } catch {
      setStatus(STATUS.ERROR);
    }
  };

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      {restored ? (
        <div className={styles.draftBar} role="status">
          <span>{BRIEF_FORM_TEXT.draftRestored}</span>
          <span className={styles.draftSeparator} aria-hidden="true">
            ·
          </span>
          <button
            type="button"
            className={styles.linkButton}
            onClick={startOver}
            disabled={isSending}
          >
            {BRIEF_FORM_TEXT.draftReset}
          </button>
        </div>
      ) : null}

      <div className={styles.quickCard}>
        <SectionQuick form={api} />

        {/* Ловушка для ботов: человек её не видит и не попадает в неё с клавиатуры */}
        <div className={styles.trap} aria-hidden="true">
          <input
            name={BRIEF_PAYLOAD_META.WEBSITE2}
            tabIndex={-1}
            autoComplete="off"
            value={trap}
            onChange={(event) => setTrap(event.target.value)}
          />
        </div>

        <div id={briefTargetId(BRIEF_ERROR_TARGET.CONSENT)}>
          <label className={styles.consent}>
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => {
                setConsent(event.target.checked);
                dismissError([BRIEF_ERROR_TARGET.CONSENT]);
                resetFailure();
              }}
              disabled={isSending}
            />
            <span>
              {BRIEF_FORM_TEXT.consentBefore}
              <Link
                href={LINKS.legal.briefConsent}
                target="_blank"
                className={styles.consentLink}
              >
                {BRIEF_FORM_TEXT.consentLink}
              </Link>
              {BRIEF_FORM_TEXT.consentMiddle}
              <Link
                href={LINKS.legal.privacy}
                target="_blank"
                className={styles.consentLink}
              >
                {BRIEF_FORM_TEXT.consentPolicyLink}
              </Link>
            </span>
          </label>
          <FieldError text={api.errorFor(BRIEF_ERROR_TARGET.CONSENT)} />
        </div>

        <div aria-live="polite">
          {status === STATUS.ERROR ? (
            <p className={styles.formError}>
              {BRIEF_FORM_TEXT.errorBefore}
              <a
                href={LINKS.support.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.consentLink}
              >
                {BRIEF_FORM_TEXT.errorSupport}
              </a>
            </p>
          ) : null}
          {status === STATUS.RATE_LIMITED ? (
            <p className={styles.formError}>{BRIEF_FORM_TEXT.rateLimited}</p>
          ) : null}
        </div>

        <div className={styles.submitRow}>
          <button type="submit" className={styles.submit} disabled={isSending}>
            {isSending ? BRIEF_FORM_TEXT.sending : BRIEF_FORM_TEXT.submit}
          </button>
          <p className={styles.replyPromise}>{BRIEF_FORM_TEXT.replyPromise}</p>
        </div>
      </div>
    </form>
  );
}
