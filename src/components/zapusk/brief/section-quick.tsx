"use client";

import { useState } from "react";
import {
  BRIEF_CONTACT_CHANNEL,
  BRIEF_CONTACT_CHANNEL_FIELD,
  BRIEF_ERROR_TARGET,
  BRIEF_FORM_TEXT,
  BRIEF_INPUT_TEXT,
  type BriefContactChannel,
} from "@/config/zapusk-page.config";
import {
  BRIEF_FIELD,
  inputMaxLengthOf,
} from "@/lib/launch-brief/launch-brief.model";
import {
  BriefChoiceGroup,
  BriefTextField,
  FieldError,
  briefTargetId,
  type BriefFormApi,
} from "./brief-controls";
import { RU_PHONE_MASK_LENGTH, maskPhoneInput } from "@/lib/phone/phone-format";
import styles from "./brief.module.css";

const CHANNELS = Object.values(BRIEF_CONTACT_CHANNEL);

/** Ошибки контакта — все показываются под одним полем. */
const CONTACT_TARGETS = [
  BRIEF_ERROR_TARGET.CONTACT,
  BRIEF_ERROR_TARGET.PHONE,
  BRIEF_ERROR_TARGET.TELEGRAM,
  BRIEF_ERROR_TARGET.MAX,
] as const;

/** Канал, в который человек уже что-то ввёл (после черновика), иначе телефон. */
const initialChannel = (form: BriefFormApi): BriefContactChannel =>
  CHANNELS.find(
    (channel) => form.state.texts[BRIEF_CONTACT_CHANNEL_FIELD[channel]] !== "",
  ) ?? BRIEF_CONTACT_CHANNEL.PHONE;

/**
 * Поля заявки — одна колонка, только основное (Руслан 10.10: «детали
 * выясним в диалоге»): имя, контакт, заведение, сколько точек, сайт, почта,
 * касса, платёжная система. Обязательны имя, контакт, заведение и касса.
 *
 * Контакт — одно поле с переключателем канала: значение лежит в том из
 * `phone` / `max` / `telegram`, чей канал выбран. Сменил канал — значение
 * переезжает, в двух полях сразу оно не живёт.
 */
export function SectionQuick({ form }: { form: BriefFormApi }) {
  const [channel, setChannel] = useState<BriefContactChannel>(() =>
    initialChannel(form),
  );
  const field = BRIEF_CONTACT_CHANNEL_FIELD[channel];
  const isPhone = channel === BRIEF_CONTACT_CHANNEL.PHONE;
  const contactError =
    CONTACT_TARGETS.map((target) => form.errorFor(target)).find(
      (text): text is string => text !== null,
    ) ?? null;

  const switchChannel = (next: BriefContactChannel) => {
    if (next === channel) return;
    const value = form.state.texts[field];
    form.setText(field, "");
    form.setText(
      BRIEF_CONTACT_CHANNEL_FIELD[next],
      next === BRIEF_CONTACT_CHANNEL.PHONE ? maskPhoneInput(value) : value,
    );
    setChannel(next);
  };

  return (
    <div className={styles.quick}>
      <div className={styles.rowHalf}>
        <BriefTextField
          form={form}
          field={BRIEF_FIELD.NAME}
          required
          target={BRIEF_ERROR_TARGET.NAME}
          autoComplete="given-name"
        />
        <BriefTextField
          form={form}
          field={BRIEF_FIELD.EMAIL}
          target={BRIEF_ERROR_TARGET.EMAIL}
          type="email"
          inputMode="email"
          autoComplete="email"
        />
      </div>

      <div
        className={styles.field}
        id={briefTargetId(BRIEF_ERROR_TARGET.CONTACT)}
      >
        <div className={styles.contactHead}>
          <label htmlFor="brief-contact" className={styles.label}>
            {BRIEF_FORM_TEXT.contactLabel}
            <span className={styles.required} aria-hidden="true">
              {BRIEF_FORM_TEXT.requiredMark}
            </span>
          </label>
          <div
            className={styles.segmented}
            role="radiogroup"
            aria-label={BRIEF_FORM_TEXT.contactLabel}
          >
            {CHANNELS.map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={option === channel}
                className={
                  option === channel
                    ? `${styles.segment} ${styles.segmentActive}`
                    : styles.segment
                }
                onClick={() => switchChannel(option)}
                disabled={form.disabled}
              >
                {BRIEF_INPUT_TEXT[BRIEF_CONTACT_CHANNEL_FIELD[option]].label}
              </button>
            ))}
          </div>
        </div>
        <input
          id="brief-contact"
          name={field}
          type={isPhone ? "tel" : "text"}
          inputMode={isPhone ? "tel" : "text"}
          autoComplete={isPhone ? "tel" : "off"}
          maxLength={isPhone ? RU_PHONE_MASK_LENGTH : inputMaxLengthOf(field)}
          placeholder={BRIEF_INPUT_TEXT[field].hint}
          value={form.state.texts[field]}
          onChange={(event) =>
            form.setText(
              field,
              isPhone ? maskPhoneInput(event.target.value) : event.target.value,
            )
          }
          className={
            contactError ? `${styles.input} ${styles.inputError}` : styles.input
          }
          aria-invalid={Boolean(contactError)}
          aria-required
          disabled={form.disabled}
        />
        <FieldError text={contactError} />
      </div>

      <div className={styles.rowVenue}>
        <BriefTextField
          form={form}
          field={BRIEF_FIELD.VENUE}
          required
          target={BRIEF_ERROR_TARGET.VENUE}
          autoComplete="organization"
        />
        <BriefTextField
          form={form}
          field={BRIEF_FIELD.SITE}
          target={BRIEF_ERROR_TARGET.SITE}
          type="url"
          inputMode="url"
          autoComplete="url"
        />
        <BriefTextField
          form={form}
          field={BRIEF_FIELD.OUTLETS_TOTAL}
          target={BRIEF_ERROR_TARGET.OUTLETS}
        />
      </div>
      <BriefChoiceGroup
        form={form}
        field={BRIEF_FIELD.POS}
        required
        target={BRIEF_ERROR_TARGET.POS}
      />
      <BriefChoiceGroup form={form} field={BRIEF_FIELD.ONLINE_PAYMENT} />
      <BriefTextField form={form} field={BRIEF_FIELD.COMMENT} multiline />
    </div>
  );
}
