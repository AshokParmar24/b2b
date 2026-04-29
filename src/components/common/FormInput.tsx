import React from "react";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  register: UseFormRegisterReturn;
  prefix?: string;
}

export function FormInput({ 
  label, 
  error, 
  register, 
  className, 
  prefix,
  ...props 
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs md:text-sm font-bold text-foreground/70 ml-1">
        {label}
      </label>
      <Input 
        {...register}
        {...props}
        prefix={prefix}
        className={cn(
          "h-12 md:h-14 rounded-2xl bg-muted/20 border-border/50 focus:bg-background focus:ring-primary/10 transition-all font-medium text-base md:text-lg",
          error && "border-destructive/50 bg-destructive/5",
          className
        )}
      />
      {error && (
        <p className="text-[10px] font-black text-destructive uppercase tracking-widest ml-2 flex items-center gap-1 animate-in slide-in-from-left-2">
          <AlertCircle className="h-3 w-3" /> {error}
        </p>
      )}
    </div>
  );
}
