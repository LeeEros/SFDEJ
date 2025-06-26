import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label: React.FC<LabelProps> = ({ children, required, ...props }) => (
  <label
    {...props}
    className={`block mb-1 font-medium text-gray-700 dark:text-gray-300 ${props.className ?? ""}`}
  >
    {children}
    {required && (
      <span className="ml-1 text-error-500 dark:text-error-400" title="Obrigatório">
        *
      </span>
    )}
  </label>
);

export default Label;
