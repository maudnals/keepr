import PersonComponent from "./PersonComponent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";

interface PersonsListComponentProps {
  personsList: Person[];
  listTitle: string;
  listTitleColor: "error" | "success";
  emptyStateText: string;
  columnHeaders: string[];
}

export default function PersonsListComponent({
  personsList,
  listTitle,
  listTitleColor,
  emptyStateText,
  columnHeaders,
}: PersonsListComponentProps) {
  return (
    <div className="persons-list-container">
      <h3>
        <Divider>
          <Chip label={listTitle} color={listTitleColor} />
        </Divider>
      </h3>
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1}>
            <Grid size={3}>{columnHeaders[0]}</Grid>
            <Grid size={5}>{columnHeaders[1]}</Grid>
            <Grid size={4}>{columnHeaders[2]}</Grid>
          </Grid>
        </Box>
      </div>
      {personsList.length === 0 ? (
        <div className="empty-state">{emptyStateText}</div>
      ) : (
        personsList.map((p) => (
          <PersonComponent person={p} key={p.resourceName}></PersonComponent>
        ))
      )}
    </div>
  );
}
