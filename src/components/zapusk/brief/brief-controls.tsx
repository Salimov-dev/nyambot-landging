"use client";

import {
  BRIEF_CHOICE_QUESTION,
  BRIEF_FORM_TEXT,
  BRIEF_ERROR_TARGET,
  BRIEF_INPUT_TEXT,
  type BriefErrorTarget,
} from "@/config/zapusk-page.config";
import {
  inputMaxLengthOf,
  type BriefChoiceField,
  type BriefChoices,
  type BriefTextInputField,
  type LaunchBriefFormState,
} from "@/lib/launch-brief/launch-brief.model";
import styles from "./brief.module.css";

/** Всё, что полям нужно от формы: ответы, правка и ошибки. */
export type BriefFormApi = {
  state: LaunchBriefFormState;
  disabled: boolean;
  setText: (field: BriefTextInputField, value: string) => void;
  setChoice: <TField extends BriefChoiceField>(
    field: TField,
    value: BriefChoices[TField],
  ) => void;
  errorFor: (target: BriefErrorTarget) => string | null;
};

/** Якорь места ошибки — к нему форма прокручивает. */
export const briefTargetId = (target: BriefErrorTarget): string =>
  `brief-target-${target}`;

const inputId = (field: string): string => `brief-${field}`;

const BRIEF_CONTACT_TARGET = BRIEF_ERROR_TARGET.CONTACT;

function RequiredMark() {
  return (
    <span className={styles.required} aria-hidden="true">
      {BRIEF_FORM_TEXT.requiredMark}
    </span>
  );
}

export function FieldError({ id, text }: { id?: string; text: string | null }) {
  return text ? (
    <span id={id} className={styles.fieldError} role="alert">
      {text}
    </span>
  ) : null;
}

/**
 * Прокрутить к месту ошибки. Ошибки контакта (телефон, MAX, Телеграм) живут
 * под одним полем короткой формы.
 */
export const revealBriefTarget = (target: BriefErrorTarget): void => {
  const element =
    document.getElementById(briefTargetId(target)) ??
    document.getElementById(briefTargetId(BRIEF_CONTACT_TARGET));
  element?.scrollIntoView({ behavior: "smooth", block: "center" });
};

type TextFieldProps = {
  form: BriefFormApi;
  field: BriefTextInputField;
  required?: boolean;
  /** Ошибка этого места — под полем. */
  target?: BriefErrorTarget;
  multiline?: boolean;
  type?: "text" | "tel" | "email" | "url";
  inputMode?: "text" | "tel" | "email" | "url" | "numeric";
  autoComplete?: string;
};

export function BriefTextField({
  form,
  field,
  required = false,
  target,
  multiline = false,
  type = "text",
  inputMode,
  autoComplete,
}: TextFieldProps) {
  const id = inputId(field);
  const copy = BRIEF_INPUT_TEXT[field];
  const error = target ? form.errorFor(target) : null;
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : undefined;
  const className = [
    styles.input,
    multiline ? styles.textarea : null,
    error ? styles.inputError : null,
  ]
    .filter((part): part is string => part !== null)
    .join(" ");

  return (
    <div
      className={styles.field}
      id={target ? briefTargetId(target) : undefined}
    >
      <label htmlFor={id} className={styles.label}>
        {copy.label}
        {required ? <RequiredMark /> : null}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={field}
          rows={2}
          maxLength={inputMaxLengthOf(field)}
          placeholder={copy.hint}
          value={form.state.texts[field]}
          onChange={(event) => form.setText(field, event.target.value)}
          className={className}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          disabled={form.disabled}
        />
      ) : (
        <input
          id={id}
          name={field}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          maxLength={inputMaxLengthOf(field)}
          placeholder={copy.hint}
          value={form.state.texts[field]}
          onChange={(event) => form.setText(field, event.target.value)}
          className={className}
          aria-invalid={Boolean(error)}
          aria-required={required || undefined}
          aria-describedby={describedBy}
          disabled={form.disabled}
        />
      )}
      <FieldError id={errorId} text={error} />
    </div>
  );
}

/** Один вариант из списка — кнопки-переключатели, все варианты видны сразу. */
export function BriefChoiceGroup<TField extends BriefChoiceField>({
  form,
  field,
  required = false,
  target,
}: {
  form: BriefFormApi;
  field: TField;
  required?: boolean;
  target?: BriefErrorTarget;
}) {
  const question = BRIEF_CHOICE_QUESTION[field];
  const current = form.state.choices[field];
  const error = target ? form.errorFor(target) : null;

  return (
    <fieldset
      className={styles.group}
      id={target ? briefTargetId(target) : undefined}
    >
      <legend className={styles.label}>
        {question.label}
        {required ? <RequiredMark /> : null}
      </legend>
      <div className={styles.chips}>
        {question.options.map((option) => (
          <label key={option.value} className={styles.chip}>
            <input
              type="radio"
              name={inputId(field)}
              value={option.value}
              checked={current === option.value}
              onChange={() => form.setChoice(field, option.value)}
              disabled={form.disabled}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <FieldError text={error} />
    </fieldset>
  );
}
