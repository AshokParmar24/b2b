"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search, Loader2, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Option {
  id: string;
  name: string;
  flag?: string;
  icon?: React.ElementType;
}

interface SearchableSelectProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean | string;
  label?: React.ReactNode;
  subLabel?: string;
  emptyMessage?: string;
  variant?: "default" | "premium";
  icon?: React.ElementType;
}

/**
 * 🔍 SEARCHABLE SELECT (COMBOBOX)
 * Custom implementation with Debounce simulation and Autocomplete feel.
 * Optimized for "Elite" branding.
 */
export function SearchableSelect({
  options,
  value,
  onChange,
  onBlur,
  placeholder = "Select option...",
  emptyMessage = "No results found.",
  className,
  disabled = false,
  error,
  label,
  subLabel,
  variant = "default",
  icon: IconProp = Globe,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Debounce Simulation for "Autocomplete" feel
  const [filteredOptions, setFilteredOptions] = React.useState(options);

  React.useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      // Force rebuild and add ultra-safe filtering
      const safeOptions = options || [];
      const filtered = safeOptions.filter((option) => {
        const name = option?.name || "";
        const searchTerm = search || "";
        return name.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredOptions(filtered);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(handler);
  }, [search, options]);

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onBlur]);

  const selectedOption = options.find((o) => o.id === value);

  const selectElement = (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "!h-14 w-full justify-between rounded-2xl transition-all active:scale-[0.98] focus:ring-4 focus:ring-primary/5",
          variant === "premium" 
            ? "bg-card/40 border-border/40 font-bold text-xs hover:bg-primary/5 hover:border-primary/20"
            : "border-slate-200 bg-slate-50/50 px-5 font-bold shadow-sm hover:bg-slate-100/50",
          open && "border-primary ring-4 ring-primary/5 bg-white dark:bg-card",
          !selectedOption && "text-muted-foreground/40",
          error && "border-rose-300 ring-4 ring-rose-100 text-rose-500"
        )}
      >
        <div className="flex items-center gap-3 truncate">
          {variant === "premium" && (
            <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <IconProp className="h-3.5 w-3.5" />
            </div>
          )}
          <div className="flex flex-col items-start gap-0.5 truncate">
            {variant === "premium" && subLabel && (
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground/50 font-black">
                {subLabel}
              </span>
            )}
            <div className="flex items-center gap-1.5 truncate">
              {selectedOption?.flag && (
                <span className="text-sm leading-none">{selectedOption.flag}</span>
              )}
              <span className="truncate">
                {selectedOption ? selectedOption.name : placeholder}
              </span>
            </div>
          </div>
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-30" />
      </Button>

      {open && (
        <div className="absolute top-full z-[100] mt-2 w-full animate-in fade-in zoom-in-95 duration-200">
          <div className={cn(
            "rounded-2xl border p-2 shadow-2xl",
            variant === "premium" 
              ? "border-border/40 bg-card/95 backdrop-blur-3xl shadow-black/10"
              : "border-slate-200 bg-white shadow-slate-200/50"
          )}>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
              <Input
                autoFocus
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={cn(
                  "h-10 rounded-xl border-none pl-10 focus:ring-0 font-bold text-sm",
                  variant === "premium" ? "bg-muted/30" : "bg-slate-50"
                )}
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-primary/40" />
              )}
            </div>

            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {filteredOptions.length === 0 ? (
                <div className="py-8 text-center text-sm font-bold text-muted-foreground/30">
                  {emptyMessage}
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      onChange(option.id);
                      setOpen(false);
                      setSearch("");
                      onBlur?.();
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all hover:bg-primary/10 hover:text-primary text-foreground/70",
                      value === option.id && "bg-primary/10 text-primary",
                      variant === "premium" && "py-3.5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {option.flag && (
                        <div className="h-8 w-8 rounded-xl bg-primary/5 flex items-center justify-center text-lg leading-none">
                          {option.flag}
                        </div>
                      )}
                      {option.icon && (
                        <div className="h-8 w-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                          <option.icon className="h-4 w-4" />
                        </div>
                      )}
                      <span>{option.name}</span>
                    </div>
                    {value === option.id && <Check className="h-4 w-4" />}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (!label && typeof error !== "string") {
    return selectElement;
  }

  return (
    <div className="space-y-2.5 w-full">
      {label && (
        <div className="flex items-center justify-between px-1">
          <label className="text-[11px] font-[900] text-muted-foreground/40 uppercase tracking-[0.25em]">
            {label}
          </label>
        </div>
      )}
      {selectElement}
      {typeof error === "string" && error && (
        <p className="ml-1 text-[10px] font-black uppercase tracking-wider text-rose-500 animate-in fade-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
}

