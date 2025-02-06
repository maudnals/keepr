import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";

interface PersonComponentProps {
  person: Person;
  key: string;
}

export default function PersonComponent({ person }: PersonComponentProps) {
  const { name, isCheckinOverdue, diff, targetCheckinFrequency, overdueRatio } =
    person;
  const isDiffInDaysPlural = (diff: number) => Math.abs(diff) > 1;
  const dayCountDisplay = `day${isDiffInDaysPlural(diff) ? "s" : ""}`;
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1}>
          <Grid size={3}>{name}</Grid>
          <Grid size={5}>
            {isCheckinOverdue
              ? `${overdueRatio}% (${diff} ${dayCountDisplay})`
              : `${diff} ${dayCountDisplay}`}
          </Grid>
          <Grid size={4}>{targetCheckinFrequency}</Grid>
        </Grid>
      </Box>
    </>
  );
}
