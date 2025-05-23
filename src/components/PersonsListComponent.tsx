import PersonComponent from "./PersonComponent";

interface PersonsListComponentProps {
  updateData: () => void;
  personsList: Person[];
  listTitle: string;
  status: "error" | "success";
  emptyStateText: string;
}

export default function PersonsListComponent({
  personsList,
  listTitle,
  status,
  emptyStateText,
  updateData,
}: PersonsListComponentProps) {
  return (
    <div className="persons-list-wrapper">
      <h2 className={status}>{listTitle}</h2>
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
