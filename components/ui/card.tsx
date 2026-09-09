import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card rounded-2xl", className)} {...props} />;
}

export function CardHover({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card card-hover rounded-2xl", className)} {...props} />;
}
