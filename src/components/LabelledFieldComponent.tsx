import { ReactNode } from "react";
import "./LabelledFieldComponent.css";

interface LabelledFieldComponentProps {
  label: string;
  // Embed a React component by passing it as a prop
  // or use a string for simple text values
  value: string | ReactNode;
}

export default function LabelledFieldComponent({
  label,
  value,
}: LabelledFieldComponentProps) {
  return (
    <div className="labelled-field-wrapper">
      <div className="label">{label}</div>
      <div>{value}</div>
    </div>
  );
}
