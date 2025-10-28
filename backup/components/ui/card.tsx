import React from "react";
export function Card({ children, className = "", ...props }: any) {
  return <div className={`rounded-xl border p-4 shadow-sm bg-white ${className}`} {...props}>{children}</div>;
}
export function CardHeader({ children, className = "", ...props }: any) {
  return <div className={`mb-2 ${className}`} {...props}>{children}</div>;
}
export function CardTitle({ children, className = "", ...props }: any) {
  return <div className={`text-lg font-semibold ${className}`} {...props}>{children}</div>;
}
export function CardContent({ children, className = "", ...props }: any) {
  return <div className={`mt-2 ${className}`} {...props}>{children}</div>;
}
