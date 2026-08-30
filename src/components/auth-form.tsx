"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signInAction, signUpAction, type AuthState } from "@/app/auth-actions";
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
  required = true,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function AuthForm({
  mode,
  notice,
  next,
}: {
  mode: "signin" | "signup";
  notice?: string;
  next?: string;
}) {
  const action = mode === "signup" ? signUpAction : signInAction;
  const [state, formAction] = useActionState<AuthState, FormData>(action, undefined);

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-8 text-center">
        <div className="text-sm font-semibold tracking-tight">LYFF</div>
        <div className="text-xs text-muted-foreground">Data Analyst / Data Science</div>
      </div>

      <div className="surface p-6">
        <h1 className="text-xl font-semibold tracking-tight">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signup"
            ? "Your plan, streak and mastery are yours alone."
            : "Sign in to pick up where you left off."}
        </p>

        {notice && (
          <p className="mt-4 rounded-md border border-easy/40 bg-easy/10 px-3 py-2 text-sm text-easy">
            {notice}
          </p>
        )}

        <form action={formAction} className="mt-6 space-y-4">
          {next && <input type="hidden" name="next" value={next} />}
          {mode === "signup" && (
            <Field label="Name" name="name" placeholder="Optional" autoComplete="name" required={false} />
          )}
          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
          <Field
            label="Password"
            name="password"
            type="password"
            placeholder={mode === "signup" ? "At least 8 characters" : ""}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            hint={mode === "signup" ? "At least 8 characters, with a letter and a number." : undefined}
          />

          {state?.error && (
            <p
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {state.error}
            </p>
          )}

          <Submit label={mode === "signup" ? "Create account" : "Sign in"} />

          {mode === "signin" && (
            <p className="text-center text-xs">
              <Link href="/forgot" className="text-muted-foreground hover:text-primary hover:underline">
                Forgotten your password?
              </Link>
            </p>
          )}
        </form>
      </div>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
