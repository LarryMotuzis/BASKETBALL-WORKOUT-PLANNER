"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

interface Props {
  action: () => Promise<void>;
  label?: string;
  successMessage?: string;
}

export function DeleteButton({
  action,
  label = "Delete",
  successMessage = "Deleted",
}: Props) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">Sure?</span>
        <button
          onClick={() =>
            startTransition(async () => {
              await action();
              toast.success(successMessage);
            })
          }
          disabled={isPending}
          className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
        >
          {isPending ? "..." : "Yes"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-red-400 hover:text-red-300 transition-colors"
    >
      {label}
    </button>
  );
}
