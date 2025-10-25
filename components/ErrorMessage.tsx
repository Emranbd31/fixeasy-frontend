import React from "react";

interface ErrorMessageProps {
  error: any;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
    <strong className="font-bold">Error:</strong>
    <span className="block sm:inline ml-2">{error?.message || String(error)}</span>
  </div>
);

export default ErrorMessage;
