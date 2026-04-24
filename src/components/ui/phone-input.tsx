"use client";

import * as React from "react";
import PhoneInputLib, { getCountryCallingCode } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@/lib/utils";
import { ChevronDown, Check, Search, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import Flags from "react-phone-number-input/flags";

interface PhoneInputProps {
  value?: string;
  onChange: (value: string) => void;
  onCountryChange?: (country?: string) => void;
  placeholder?: string;
  error?: boolean | string;
  label?: React.ReactNode;
}

const CountrySelect = ({ value, onChange, options, disabled }: any) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o: any) => o.value === value);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option: any) => {
    if (!option.value) return false;
    const countryName = option.label.toLowerCase();
    const countryCode = getCountryCallingCode(option.value);
    return countryName.includes(search.toLowerCase()) || countryCode.includes(search);
  });

  const FlagComponent = (country: string) => {
    const FlagIcon = (Flags as any)[country];
    return FlagIcon ? <FlagIcon className="w-full h-full object-cover" /> : <Globe className="w-full h-full text-slate-300" />;
  };

  return (
    <div className="relative h-full flex items-center" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="flex h-full items-center gap-2 px-4 border-r border-slate-200 transition-all hover:bg-slate-100/50 rounded-l-2xl group active:scale-95 cursor-pointer"
      >
        {selectedOption ? (
          <div className="w-7 h-5 shadow-sm rounded-[3px] overflow-hidden border border-slate-100 flex-shrink-0">
            {FlagComponent(selectedOption.value)}
          </div>
        ) : (
          <Globe className="h-5 w-5 text-slate-300" />
        )}
        <ChevronDown className={cn(
          "h-3.5 w-3.5 text-slate-300 transition-transform duration-300 group-hover:text-primary",
          open && "rotate-180 text-primary"
        )} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-[100] mt-3 w-[320px] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-[0_25px_60px_-12px_rgba(0,0,0,0.18)]">
            <div className="p-3 border-b border-slate-50">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  autoFocus
                  placeholder="Search country..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 rounded-2xl border-none bg-slate-50 pl-11 pr-4 font-bold text-[14px] focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="max-h-[350px] overflow-y-auto p-2 custom-scrollbar">
              {filteredOptions.length === 0 ? (
                <div className="py-10 text-center flex flex-col items-center gap-3 opacity-40">
                  <Globe className="h-8 w-8 text-slate-300" />
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">No Matches</p>
                </div>
              ) : (
                filteredOptions.map((option: any) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={cn(
                      "flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-[15px] font-bold transition-all hover:bg-primary/5 hover:text-primary group cursor-pointer",
                      value === option.value
                        ? "bg-primary/[0.08] text-primary"
                        : "text-slate-700 hover:translate-x-1"
                    )}
                  >
                    <div className="w-7 h-5 shadow-sm rounded-[3px] overflow-hidden border border-slate-100 flex-shrink-0 transition-transform group-hover:scale-110">
                      {FlagComponent(option.value)}
                    </div>
                    <span className="flex-1 text-left truncate font-black tracking-tight">
                      {option.label}
                    </span>
                    <span className={cn(
                      "text-[12px] font-black tracking-tighter opacity-40 group-hover:opacity-100",
                      value === option.value && "opacity-100"
                    )}>
                      +{getCountryCallingCode(option.value)}
                    </span>
                    {value === option.value && <Check className="h-4 w-4 animate-in zoom-in-50" />}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export function PhoneInput({
  value,
  onChange,
  onCountryChange,
  placeholder = "Enter phone number",
  error,
  label,
}: PhoneInputProps) {
  const inputElement = (
    <div className={cn("phone-input-elite w-full", error && "phone-input-error")}>
      <PhoneInputLib
        international
        defaultCountry="IN"
        value={value || undefined}
        onChange={(val) => onChange(val ?? "")}
        onCountryChange={onCountryChange}
        countrySelectComponent={CountrySelect}
        placeholder={placeholder}
        className={cn(
          "flex h-14 w-full items-center rounded-2xl border border-slate-200 bg-slate-50/50 transition-all focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/5 shadow-sm",
          error && "border-rose-300 ring-4 ring-rose-100"
        )}
      />

      <style jsx global>{`
        .phone-input-elite .PhoneInputInput {
          background: transparent;
          border: none !important;
          font-weight: 700;
          font-size: 0.875rem;
          color: #0f172a;
          outline: none;
          height: 100%;
          width: 100%;
          padding-left: 1.25rem;
          box-shadow: none !important;
        }
        .phone-input-elite .PhoneInputInput::placeholder {
          color: #94a3b8;
          font-weight: 700;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );

  if (!label && typeof error !== "string") {
    return inputElement;
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
      {inputElement}
      {typeof error === "string" && error && (
        <p className="ml-1 text-[10px] font-black uppercase tracking-wider text-rose-500 animate-in fade-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
}
