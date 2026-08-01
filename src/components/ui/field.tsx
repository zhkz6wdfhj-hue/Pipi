'use client';

/**
 * Formuliervelden. Elk veld heeft een zichtbaar label, een eigen id en — als er
 * iets misgaat — een foutmelding die via aria-describedby aan het veld hangt,
 * zodat een schermlezer hem meteen voorleest.
 */

import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

const controlClasses =
  'w-full rounded-xs border bg-surface px-3.5 py-2.5 text-[0.9375rem] text-ink placeholder:text-ink-soft/60 transition-colors duration-200 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

function borderFor(error?: string | null): string {
  return error ? 'border-error' : 'border-line hover:border-line-strong';
}

interface WrapperProps {
  label: string;
  htmlFor: string;
  error?: string | null;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}

function FieldWrapper({ label, htmlFor, error, hint, optional, children, className }: WrapperProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[0.8125rem] text-ink">
        {label}
        {optional ? <span className="text-ink-soft"> (niet verplicht)</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${htmlFor}-hint`} className="mt-1.5 text-[0.8125rem] text-ink-soft">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${htmlFor}-fout`} className="mt-1.5 text-[0.8125rem] text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  error?: string | null;
  hint?: string;
  optional?: boolean;
  wrapperClassName?: string;
}

export function TextField({
  label,
  error,
  hint,
  optional,
  wrapperClassName,
  className,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const id = props.name ? `veld-${props.name}` : generatedId;

  return (
    <FieldWrapper
      label={label}
      htmlFor={id}
      error={error}
      hint={hint}
      optional={optional}
      className={wrapperClassName}
    >
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-fout` : hint ? `${id}-hint` : undefined}
        className={[controlClasses, borderFor(error), className].filter(Boolean).join(' ')}
        {...props}
      />
    </FieldWrapper>
  );
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label: string;
  error?: string | null;
  hint?: string;
  wrapperClassName?: string;
  children: ReactNode;
}

export function SelectField({
  label,
  error,
  hint,
  wrapperClassName,
  className,
  children,
  ...props
}: SelectFieldProps) {
  const generatedId = useId();
  const id = props.name ? `veld-${props.name}` : generatedId;

  return (
    <FieldWrapper label={label} htmlFor={id} error={error} hint={hint} className={wrapperClassName}>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-fout` : hint ? `${id}-hint` : undefined}
        className={[controlClasses, borderFor(error), 'appearance-none pr-9', className]
          .filter(Boolean)
          .join(' ')}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' fill='none' stroke='%235B534B' stroke-width='1.4'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.9rem center',
        }}
        {...props}
      >
        {children}
      </select>
    </FieldWrapper>
  );
}

interface TextAreaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  error?: string | null;
  hint?: string;
  optional?: boolean;
  wrapperClassName?: string;
}

export function TextAreaField({
  label,
  error,
  hint,
  optional,
  wrapperClassName,
  className,
  ...props
}: TextAreaFieldProps) {
  const generatedId = useId();
  const id = props.name ? `veld-${props.name}` : generatedId;

  return (
    <FieldWrapper
      label={label}
      htmlFor={id}
      error={error}
      hint={hint}
      optional={optional}
      className={wrapperClassName}
    >
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-fout` : hint ? `${id}-hint` : undefined}
        className={[controlClasses, borderFor(error), 'min-h-36 resize-y', className]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    </FieldWrapper>
  );
}

interface CheckboxFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> {
  label: ReactNode;
  error?: string | null;
}

export function CheckboxField({ label, error, className, ...props }: CheckboxFieldProps) {
  const generatedId = useId();
  const id = props.name ? `veld-${props.name}` : generatedId;

  return (
    <div className={className}>
      <div className="flex items-start gap-2.5">
        <input
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-fout` : undefined}
          className="mt-1 h-4 w-4 shrink-0 rounded-xs border border-line accent-[#6B5B47]"
          {...props}
        />
        <label htmlFor={id} className="text-[0.875rem] leading-relaxed text-ink-soft">
          {label}
        </label>
      </div>
      {error ? (
        <p id={`${id}-fout`} className="mt-1.5 text-[0.8125rem] text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
