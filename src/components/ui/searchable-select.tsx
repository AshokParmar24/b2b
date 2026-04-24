"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Option {
  id: string;
  name: string;
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
  emptyMessage?: string;
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
      const filtered = options.filter((option) =>
        option.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredOptions(filtered);
      setIsSearching(false);
    }, 300); // 300ms Debounce

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
          "h-14 w-full justify-between rounded-2xl border border-slate-200 bg-slate-50/50 px-5 font-bold shadow-sm transition-all hover:bg-slate-100/50 active:scale-[0.98] focus:ring-4 focus:ring-primary/5",
          open && "border-primary ring-4 ring-primary/5 bg-white",
          !selectedOption && "text-slate-400",
          error && "border-rose-300 ring-4 ring-rose-100 text-rose-500"
        )}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div className="absolute top-full z-[100] mt-2 w-full animate-in fade-in zoom-in-95 duration-200">
          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-200/50">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                autoFocus
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 rounded-xl border-none bg-slate-50 pl-10 focus:ring-0"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-300" />
              )}
            </div>

            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm font-bold text-slate-400">
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
                      "flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-colors hover:bg-primary/5 hover:text-primary text-slate-700",
                      value === option.id && "bg-primary/10 text-primary"
                    )}
                  >
                    {option.name}
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
          <label className="text-[11px] font-[900] text-slate-400 uppercase tracking-[0.25em]">
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
