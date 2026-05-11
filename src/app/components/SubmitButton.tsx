"use client";

import { useFormStatus } from "react-dom";

interface Props {
  label: string;
  pendingLabel: string;
  className?: string;
}

export function SubmitButton({ label, pendingLabel, className }: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={
        className ??
        "w-fit rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-60 px-5 py-3 text-white font-semibold transition-colors"
      }
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
