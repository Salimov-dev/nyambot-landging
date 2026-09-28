"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import {
  LEAD_API,
  LEAD_CHOICE,
  LEAD_CHOICE_QUESTIONS,
  LEAD_ERROR_CODE,
  LEAD_FIELD,
  LEAD_FIELD_ERROR,
  LEAD_FORM_TEXT,
  LEAD_HAVE_QUESTION,
  LEAD_MISSING_TEXT,
  type LeadChoice,
  type LeadField,
} from "@/config/zapusk-page.config";
import styles from "./zapusk.module.css";

const STATUS = {
  IDLE: "idle",
  SENDING: "sending",
  SUCCESS: "success",
  ERROR: "error",
  RATE_LIMITED: "rateLimited",
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS];

type Values = Record<LeadField, string>;
type Choices = Record<LeadChoice, string>;

const EMPTY_VALUES: Values = {
  [LEAD_FIELD.VENUE]: "",
  [LEAD_FIELD.CITY]: "",
  [LEAD_FIELD.SITE]: "",
  [LEAD_FIELD.NAME]: "",
  [LEAD_FIELD.EMAIL]: "",
  [LEAD_FIELD.TELEGRAM]: "",
  [LEAD_FIELD.MAX]: "",
  [LEAD_FIELD.COMMENT]: "",
};

const EMPTY_CHOICES: Choices = {
  [LEAD_CHOICE.POS]: "",
  [LEAD_CHOICE.OUTLETS]: "",
  [LEAD_CHOICE.PAYMENT]: "",
};

const missingOf = (values: Values, consent: boolean): string | null => {
  if (!values.venue.trim()) return LEAD_MISSING_TEXT.venue;
  if (!values.city.trim()) return LEAD_MISSING_TEXT.city;
  if (!values.name.trim()) return LEAD_MISSING_TEXT.name;
  if (!values.email.trim() && !values.telegram.trim() && !values.max.trim()) {
    return LEAD_MISSING_TEXT.contact;
  }
  if (!consent) return LEAD_MISSING_TEXT.consent;
  return null;
};

type InputOptions = {
  hint?: string;
  type?: string;
  autoComplete?: string;
};

/**
 * Форма заявки на бесплатный разбор: обязательное — заведение, город, имя,
 * один контакт и согласие; необязательное — касса, точки, оплата, что уже
 * есть и комментарий (решение Руслана 28.09.2026).
 *
 * Защита от ботов без капчи: скрытое поле-ловушка и время открытия формы —
 * main-server отсекает тех, кто заполнил ловушку или уложился быстрее трёх
 * секунд. Цель Метрики уходит только после ответа «принято».
 */
export function LeadForm() {
  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const [choices, setChoices] = useState<Choices>(EMPTY_CHOICES);
  const [have, setHave] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState<Status>(STATUS.IDLE);
  const [fieldError, setFieldError] = useState<{
    field: LeadField;
    text: string;
  } | null>(null);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const missing = missingOf(values, consent);
  const isSending = status === STATUS.SENDING;

  const resetFailure = () => {
    if (status === STATUS.ERROR || status === STATUS.RATE_LIMITED) {
      setStatus(STATUS.IDLE);
    }
  };

  const update = (field: LeadField, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (fieldError?.field === field) setFieldError(null);
    resetFailure();
  };

  const toggleHave = (value: string) => {
    setHave((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (missing || isSending) return;

    setStatus(STATUS.SENDING);
    setFieldError(null);

    const trimmed = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value.trim()]),
    );

    try {
      const response = await fetch(LEAD_API.LANDING_ROUTE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...trimmed,
          ...choices,
          have,
          consent,
          page: window.location.href,
          startedAt: startedAt.current,
          website2: trap,
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (response.ok && data?.ok) {
        setStatus(STATUS.SUCCESS);
        reachGoal("lead_form");
        return;
      }

      const byField = data?.error ? LEAD_FIELD_ERROR[data.error] : undefined;
      if (byField) {
        setFieldError(byField);
        setStatus(STATUS.IDLE);
        return;
      }
      setStatus(
        data?.error === LEAD_ERROR_CODE.RATE_LIMITED
          ? STATUS.RATE_LIMITED
          : STATUS.ERROR,
      );
    } catch {
      setStatus(STATUS.ERROR);
    }
  };

  if (status === STATUS.SUCCESS) {
    return (
      <div className={styles.formCard} role="status" aria-live="polite">
        <p className={styles.successTitle}>{LEAD_FORM_TEXT.successTitle}</p>
        <p className={styles.successText}>{LEAD_FORM_TEXT.successText}</p>
      </div>
    );
  }

  const input = (
    field: LeadField,
    label: string,
    options: InputOptions = {},
  ) => {
    const id = `lead-${field}`;
    const error = fieldError?.field === field ? fieldError.text : null;

    return (
      <div className={styles.field}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        <input
          id={id}
          name={field}
          type={options.type ?? "text"}
          autoComplete={options.autoComplete}
          placeholder={options.hint}
          value={values[field]}
          onChange={(event) => update(field, event.target.value)}
          className={
            error ? `${styles.input} ${styles.inputError}` : styles.input
          }
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          disabled={isSending}
        />
        {error ? (
          <span id={`${id}-error`} className={styles.fieldError}>
            {error}
          </span>
        ) : null}
      </div>
    );
  };

  return (
    <form className={styles.formCard} onSubmit={submit} noValidate>
      <h2 className={styles.formTitle}>{LEAD_FORM_TEXT.title}</h2>

      <div className={styles.fieldGrid}>
        {input(LEAD_FIELD.VENUE, LEAD_FORM_TEXT.venueLabel, {
          hint: LEAD_FORM_TEXT.venueHint,
          autoComplete: "organization",
        })}
        {input(LEAD_FIELD.CITY, LEAD_FORM_TEXT.cityLabel, {
          hint: LEAD_FORM_TEXT.cityHint,
          autoComplete: "address-level2",
        })}
        {input(LEAD_FIELD.SITE, LEAD_FORM_TEXT.siteLabel, {
          hint: LEAD_FORM_TEXT.siteHint,
          autoComplete: "url",
        })}
        {input(LEAD_FIELD.NAME, LEAD_FORM_TEXT.nameLabel, {
          hint: LEAD_FORM_TEXT.nameHint,
          autoComplete: "given-name",
        })}
      </div>

      <fieldset className={styles.group}>
        <legend className={styles.groupTitle}>
          {LEAD_FORM_TEXT.contactsTitle}
        </legend>
        <div className={styles.contactRow}>
          {input(LEAD_FIELD.EMAIL, LEAD_FORM_TEXT.emailLabel, {
            hint: LEAD_FORM_TEXT.emailHint,
            type: "email",
            autoComplete: "email",
          })}
          {input(LEAD_FIELD.TELEGRAM, LEAD_FORM_TEXT.telegramLabel, {
            hint: LEAD_FORM_TEXT.telegramHint,
          })}
          {input(LEAD_FIELD.MAX, LEAD_FORM_TEXT.maxLabel, {
            hint: LEAD_FORM_TEXT.maxHint,
            type: "tel",
            autoComplete: "tel",
          })}
        </div>
      </fieldset>

      <div className={styles.optional}>
        <p className={styles.optionalTitle}>{LEAD_FORM_TEXT.optionalTitle}</p>

        {LEAD_CHOICE_QUESTIONS.map((question) => (
          <fieldset key={question.name} className={styles.group}>
            <legend className={styles.groupTitle}>{question.title}</legend>
            <div className={styles.chips}>
              {question.options.map((option) => (
                <label key={option.value} className={styles.chip}>
                  <input
                    type="radio"
                    name={question.name}
                    value={option.value}
                    checked={choices[question.name] === option.value}
                    onChange={() =>
                      setChoices((prev) => ({
                        ...prev,
                        [question.name]: option.value,
                      }))
                    }
                    disabled={isSending}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        <fieldset className={styles.group}>
          <legend className={styles.groupTitle}>
            {LEAD_HAVE_QUESTION.title}
          </legend>
          <div className={styles.chips}>
            {LEAD_HAVE_QUESTION.options.map((option) => (
              <label key={option.value} className={styles.chip}>
                <input
                  type="checkbox"
                  value={option.value}
                  checked={have.includes(option.value)}
                  onChange={() => toggleHave(option.value)}
                  disabled={isSending}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={styles.field}>
          <label htmlFor="lead-comment" className={styles.label}>
            {LEAD_FORM_TEXT.commentLabel}
          </label>
          <textarea
            id="lead-comment"
            name={LEAD_FIELD.COMMENT}
            rows={3}
            placeholder={LEAD_FORM_TEXT.commentHint}
            value={values.comment}
            onChange={(event) => update(LEAD_FIELD.COMMENT, event.target.value)}
            className={`${styles.input} ${styles.textarea}`}
            disabled={isSending}
          />
        </div>
      </div>

      {/* Ловушка для ботов: человек её не видит и не попадает в неё с клавиатуры */}
      <div className={styles.trap} aria-hidden="true">
        <input
          name="website2"
          tabIndex={-1}
          autoComplete="off"
          value={trap}
          onChange={(event) => setTrap(event.target.value)}
        />
      </div>

      <label className={styles.consent}>
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          disabled={isSending}
        />
        <span>
          {LEAD_FORM_TEXT.consentBefore}
          <Link
            href={LINKS.legal.privacy}
            target="_blank"
            className={styles.consentLink}
          >
            {LEAD_FORM_TEXT.consentLink}
          </Link>
        </span>
      </label>

      <div aria-live="polite">
        {missing ? <p className={styles.missing}>{missing}</p> : null}
        {status === STATUS.ERROR ? (
          <p className={styles.formError}>
            {LEAD_FORM_TEXT.errorBefore}
            <a
              href={LINKS.support.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.consentLink}
            >
              {LEAD_FORM_TEXT.errorSupport}
            </a>
          </p>
        ) : null}
        {status === STATUS.RATE_LIMITED ? (
          <p className={styles.formError}>{LEAD_FORM_TEXT.rateLimited}</p>
        ) : null}
      </div>

      <button
        type="submit"
        className={styles.submit}
        disabled={Boolean(missing) || isSending}
      >
        {isSending ? LEAD_FORM_TEXT.sending : LEAD_FORM_TEXT.submit}
      </button>
    </form>
  );
}
