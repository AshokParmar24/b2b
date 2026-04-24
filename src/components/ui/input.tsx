import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

import { Label } from "@/components/ui/label";

interface InputProps extends React.ComponentProps<"input"> {
  autoFocus?: boolean;
  error?: boolean | string;
  label?: React.ReactNode;
  labelAction?: React.ReactNode;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, autoFocus = false, error, label, labelAction, icon, suffix, id, ...props }, ref) => {
    const inputElement = (
      <InputPrimitive
        type={type}
        id={id}
        data-slot="input"
        ref={ref}
        className={cn(
          "border-input file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 h-8 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm",
          error && "border-rose-300 ring-4 ring-rose-100",
          className
        )}
        autoFocus={autoFocus}
        aria-invalid={!!error}
        {...props}
      />
    );

    const inputWithAdornments = icon || suffix ? (
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
            {icon}
          </div>
        )}
        {inputElement}
        {suffix && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300">
            {suffix}
          </div>
        )}
      </div>
    ) : (
      inputElement
    );

    if (!label && typeof error !== "string") {
      return inputWithAdornments;
    }

    return (
      <div className="space-y-2.5 w-full">
        {label && (
          <div className="flex items-center justify-between px-1">
            <Label htmlFor={id} className="text-[11px] font-[900] text-slate-400 uppercase tracking-[0.25em]">
              {label}
            </Label>
            {labelAction}
          </div>
        )}
        {inputWithAdornments}
        {typeof error === "string" && error && (
          <p className="ml-1 text-[10px] font-black uppercase tracking-wider text-rose-500 animate-in fade-in slide-in-from-top-1 duration-200">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
