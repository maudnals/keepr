import PersonComponent from "./PersonComponent";
import "./PersonsListComponent.css";

interface PersonsListComponentProps {
  updateData: () => void;
  personsList: Person[];
  listTitle: string;
  status: "error" | "success" | "neutral";
  emptyStateText: string;
  subtitle?: string;
}

export default function PersonsListComponent({
  personsList,
  listTitle,
  status,
  emptyStateText,
  updateData,
  subtitle,
}: PersonsListComponentProps) {
  return (
    <div className="persons-list-wrapper">
      <h2 className={status}>{listTitle}</h2>
      {subtitle && <p className="subtitle">{subtitle}</p>}
      {personsList.length === 0 ? (
        <div className="empty-state">{emptyStateText}</div>
      ) : (
        personsList.map((p) => (
          <PersonComponent
            person={p}
            key={p.resourceName}
            updateData={updateData}
          ></PersonComponent>
        ))
      )}
    </div>
  );
}
