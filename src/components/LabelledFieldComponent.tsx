import { ReactNode } from "react";
import "./LabelledFieldComponent.css";

interface LabelledFieldComponentProps {
  label: string;
  // Can pass a React component as a prop to embed it
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
