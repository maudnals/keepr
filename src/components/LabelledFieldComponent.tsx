import { ReactNode } from "react";
import "./LabelledFieldComponent.css";

interface LabelledFieldComponentProps {
  label: string;
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
