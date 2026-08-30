"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { completeResetAction, requestResetAction, type AuthState } from "@/app/auth-actions";
import { Button } from "./ui";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Just a moment…" : label}
    </Button>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

function Shell({ title, blurb, children }: { title: string; blurb: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-8 text-center">
        <div className="text-sm font-semibold tracking-tight">LYFF</div>
        <div className="text-xs text-muted-foreground">Data Analyst / Data Science</div>
      </div>
      <div className="surface p-6">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{blurb}</p>
        {children}
      </div>
    </div>
  );
}

function Message({ state }: { state: AuthState }) {
  if (state?.error) {
    return (
      <p
        role="alert"
        className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
      >
        {state.error}
      </p>
    );
  }
  if (state?.notice) {
    return (
      <p className="rounded-md border border-easy/40 bg-easy/10 px-3 py-2 text-sm text-easy">
        {state.notice}
      </p>
    );
  }
  return null;
}

export function ForgotForm() {
  const [state, action] = useActionState<AuthState, FormData>(requestResetAction, undefined);

  return (
    <Shell
      title="Reset your password"
      blurb="Enter your email and we will send you a link to choose a new one."
    >
      <form action={action} className="mt-6 space-y-4">
        <Field label="Email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
        <Message state={state} />
        <Submit label="Send reset link" />
      </form>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        <Link href="/signin" className="text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </Shell>
  );
}

export function ResetForm({ token }: { token: string }) {
  const [state, action] = useActionState<AuthState, FormData>(completeResetAction, undefined);

  return (
    <Shell title="Choose a new password" blurb="This link works once and expires an hour after it was sent.">
      <form action={action} className="mt-6 space-y-4">
        <input type="hidden" name="token" value={token} />
        <Field
          label="New password"
          name="password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters, with a letter and a number."
        />
        <Field label="Confirm password" name="confirm" type="password" autoComplete="new-password" />
        <Message state={state} />
        <Submit label="Set new password" />
      </form>
      <p className="mt-5 text-center text-xs text-muted-foreground">
        Setting a new password signs out every other device.
      </p>
    </Shell>
  );
}
