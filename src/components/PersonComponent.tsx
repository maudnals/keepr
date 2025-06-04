import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import dayjs from "dayjs";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {
  PEOPLE_API_PROPERTIES,
  overdueRatioFormatter,
  remainingDaysUntilCheckinFormatter,
} from "../utils/utils";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LabelledFieldComponent from "./LabelledFieldComponent";
import EditableDateComponent from "./EditableDateComponent";

interface PersonComponentProps {
  person: Person;
  key: string;
  updateData: Function;
}

let devMode = false;

export default function PersonComponent({
  person,
  updateData,
}: PersonComponentProps) {
  const {
    resourceName,
    etag,
    name,
    targetCheckinFrequency,
    lastCheckin,
    isCheckinOverdue,
    diff,
    overdueRatio,
    userDefinedRaw,
  } = person;

  function updateLastCheckinDateToToday() {
    const today = new Date();
    // resourceName = 'people/c1234567890'
    // updateDate(resourceName, etag);
    updateUserDefinedPpty(
      resourceName,
      etag,
      PEOPLE_API_PROPERTIES.lastCheckin,
      today.toDateString() // 'Sat Feb 15 2025'
    );
  }

  // pptyName = PEOPLE_API_PROPERTIES.lastCheckin;
  // pptyValue = lastCheckinInputValue.toDate().toDateString(); // 'Sat Feb 15 2025'
  function updateUserDefinedPpty(personId, etag, pptyName, pptyValue) {
    // TODO support setting this to unset
    let updatedPptyToUpdate = {
      value: pptyName,
      key: pptyValue,
    };

    if (userDefinedRaw) {
      const existing = userDefinedRaw.filter(
        (item: any) => item.value === pptyName
      )[0];
      if (existing) {
        updatedPptyToUpdate = { ...existing, ...updatedPptyToUpdate };
      }
    }
    let updatedUserDefinedPpties = [updatedPptyToUpdate];

    if (userDefinedRaw) {
      const existingPpties = userDefinedRaw.filter(
        (item: any) => item.value !== pptyName
      );
      if (existingPpties.length > 0) {
        updatedUserDefinedPpties = [
          ...existingPpties,
          ...updatedUserDefinedPpties,
        ];
      }
    }
    }

    console.log("updatedUserDefinedPpties", updatedUserDefinedPpties);
    gapi.client.people.people
      .updateContact({
        resourceName: personId, // The resource name of the contact to update (important!)
        etag: etag,
        updatePersonFields: "userDefined", // Specifies which fields to update (crucial for partial updates)
        userDefined: updatedUserDefinedPpties,
      })
      .then(
        function (response) {
          console.log("Contact updated: ", response.result);
          updateData();
        },
        function (reason) {
          console.error("Error updating contact: ", reason);
        }
      );
  }

  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Grid container size="grow">
            <Grid size={6}>
              {name}
              {devMode && etag}
            </Grid>
            <Grid size={6}>
              <Button onClick={updateLastCheckinDateToToday} variant="outlined">
                Done
              </Button>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <LabelledFieldComponent
            label={isCheckinOverdue ? "Overdue by" : "Next check-in due in..."}
            value={
              targetCheckinFrequency
                ? isCheckinOverdue
                  ? overdueRatioFormatter(overdueRatio, diff)
                  : remainingDaysUntilCheckinFormatter(diff)
                : "N/A"
            }
          />
          <LabelledFieldComponent
            label="Last check-in"
            value={
              <EditableDateComponent
                dateValue={lastCheckin ? dayjs(new Date(lastCheckin)) : null}
                setDate={(inputValue) => {
                  updateUserDefinedPpty(
                    resourceName,
                    etag,
                    KEEPR_PPTIES.lastCheckin,
                    inputValue.toDate().toDateString() // 'Sat Feb 15 2025'
                  );
                  // setLastCheckinInputValue(dayjs(lastCheckinInputValue));
                  // saveDateAndClose();
                }}
              />
            }
          />
          <LabelledFieldComponent
            label="Target check-in frequency"
            value={
              <Select
                id="target-frequency"
                value={targetCheckinFrequency ? targetCheckinFrequency : null}
                onChange={(event) => {
                  setTargetFrequencyInputValue(event.target.value as Frequency);
                }}
                label="frequency"
              >
                {/* <MenuItem value={null}>Unset</MenuItem> */}
                <MenuItem value={"weekly"}>Weekly</MenuItem>
                <MenuItem value={"fortnightly"}>Fortnightly</MenuItem>
                <MenuItem value={"monthly"}>Monthly</MenuItem>
                <MenuItem value={"yearly"}>Yearly</MenuItem>
              </Select>
            }
          />
          <Box sx={{ flexGrow: 1 }}>
            <Grid
              container
              spacing={1}
              sx={{
                justifyContent: "space-around",
                alignItems: "center",
              }}
            ></Grid>
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
