import React from "react";
export function Tabs({ value, onValueChange, children, className = "" }: any) {
  return <div className={className}>{children}</div>;
}
export function TabsList({ children, className = "" }: any) {
  return <div className={`flex gap-2 ${className}`}>{children}</div>;
}
export function TabsTrigger({ value, children, className = "", ...props }: any) {
  return <button className={`px-3 py-1 rounded ${className}`} {...props}>{children}</button>;
}
export function TabsContent({ value, children, className = "", ...props }: any) {
  return <div className={className} {...props}>{children}</div>;
}
