"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground " +
  "placeholder:text-subtle focus-visible:outline-2 focus-visible:outline-offset-1 " +
  "focus-visible:outline-ring disabled:opacity-50";

interface FieldWrapperProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: (id: string, describedBy: string | undefined) => React.ReactNode;
}

function FieldWrapper({ label, error, hint, required, children }: FieldWrapperProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {required && <span className="text-danger" aria-hidden> *</span>}
      </label>
      {children(id, describedBy)}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-danger" role="alert">{error}</p>
      )}
    </div>
  );
}

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export function InputField({ label, error, hint, required, className, ...props }: InputFieldProps) {
  return (
    <FieldWrapper label={label} error={error} hint={hint} required={required}>
      {(id, describedBy) => (
        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          required={required}
          className={cn(fieldBase, error && "border-danger", className)}
          {...props}
        />
      )}
    </FieldWrapper>
  );
}

type TextareaFieldProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export function TextareaField({ label, error, hint, required, className, ...props }: TextareaFieldProps) {
  return (
    <FieldWrapper label={label} error={error} hint={hint} required={required}>
      {(id, describedBy) => (
        <textarea
          id={id}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          required={required}
          className={cn(fieldBase, "min-h-24", error && "border-danger", className)}
          {...props}
        />
      )}
    </FieldWrapper>
  );
}

type SelectFieldProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export function SelectField({ label, error, hint, required, className, children, ...props }: SelectFieldProps) {
  return (
    <FieldWrapper label={label} error={error} hint={hint} required={required}>
      {(id, describedBy) => (
        <select
          id={id}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          required={required}
          className={cn(fieldBase, error && "border-danger", className)}
          {...props}
        >
          {children}
        </select>
      )}
    </FieldWrapper>
  );
}
