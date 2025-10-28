import React from "react";
export function Button({ children, onClick, className = "", type = "button", disabled = false, variant = "default", size = "md", asChild = false, ...props }: any) {
  const base = "rounded-md px-4 py-2 font-medium focus:outline-none transition ";
  const variants: any = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50",
  };
  const sizes: any = {
    sm: "text-xs py-1 px-2",
    md: "text-sm py-2 px-4",
    lg: "text-base py-3 px-6",
    icon: "p-2",
  };
  const btnClass = `${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`;
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { className: btnClass, onClick, disabled, ...props });
  }
  return <button type={type} onClick={onClick} className={btnClass} disabled={disabled} {...props}>{children}</button>;
}
