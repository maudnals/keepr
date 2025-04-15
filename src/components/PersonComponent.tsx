import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import { Check, Close, Edit } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {
  KEEPR_PPTIES,
  overdueRatioFormatter,
  remainingDaysUntilCheckinFormatter,
} from "../utils/utils";
import Button from "@mui/material/Button";

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

  const [editModeForDate, setEditModeForDate] = useState(false);
  const [lastCheckinInputValue, setLastCheckinInputValue] = useState(
    lastCheckin ? dayjs(new Date(lastCheckin)) : null
  );
  const [editModeForTargetFrequency, setEditModeForTargetFrequency] =
    useState(false);
  const [targetFrequencyInputValue, setTargetFrequencyInputValue] = useState(
    targetCheckinFrequency
  );

  function exitDateEdit() {
    setEditModeForDate(false);
  }

  function exitTargetFrequencyEdit() {
    setEditModeForTargetFrequency(false);
  }

  function updateLastCheckinDateToToday() {
    const today = new Date();
    // resourceName = 'people/c1234567890'
    // updateDate(resourceName, etag);
    updateUserDefinedPpty(
      resourceName,
      etag,
      KEEPR_PPTIES.lastCheckin,
      today.toDateString() // 'Sat Feb 15 2025'
    );
  }

  function saveDateAndClose() {
    // resourceName = 'people/c1234567890'
    // updateDate(resourceName, etag);
    updateUserDefinedPpty(
      resourceName,
      etag,
      KEEPR_PPTIES.lastCheckin,
      lastCheckinInputValue.toDate().toDateString() // 'Sat Feb 15 2025'
    );
    setEditModeForDate(false);
  }

  function saveTargetFrequencyAndClose() {
    // resourceName = 'people/c1234567890'
    updateTargetFrequency(resourceName, etag);
    setEditModeForTargetFrequency(false);
  }

  // updateUserDefinedPpty(personId, etag, KEEPR_PPTIES.lastCheckin, lastCheckinInputValue.toDate().toDateString())

  // pptyName = KEEPR_PPTIES.lastCheckin;
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

  function updateDate(personId, etag) {
    // TODO support setting this to unset
    const updatedLastCheckin = lastCheckinInputValue.toDate().toDateString(); // 'Sat Feb 15 2025'
    let updatedPptyToUpdate = {
      value: KEEPR_PPTIES.lastCheckin,
      key: updatedLastCheckin,
    };

    if (userDefinedRaw) {
      const existing = userDefinedRaw.filter(
        (item: any) => item.value === KEEPR_PPTIES.lastCheckin
      )[0];
      if (existing) {
        updatedPptyToUpdate = { ...existing, ...updatedPptyToUpdate };
      }
    }
    let updatedUserDefinedPpties = [updatedPptyToUpdate];

    if (userDefinedRaw) {
      const existingPpties = userDefinedRaw.filter(
        (item: any) => item.value !== KEEPR_PPTIES.lastCheckin
      );
      if (existingPpties.length > 0) {
        updatedUserDefinedPpties = [
          ...existingPpties,
          ...updatedUserDefinedPpties,
        ];
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

  function updateTargetFrequency(personId, etag) {
    // TODO support setting this to unset
    let updatedPptyToUpdate = {
      value: KEEPR_PPTIES.targetCheckinFrequency,
      key: targetFrequencyInputValue,
    };

    if (userDefinedRaw) {
      const existing = userDefinedRaw.filter(
        (item: any) => item.value === KEEPR_PPTIES.targetCheckinFrequency
      )[0];
      if (existing) {
        updatedPptyToUpdate = { ...existing, ...updatedPptyToUpdate };
      }
    }
    let updatedUserDefinedPpties = [updatedPptyToUpdate];

    if (userDefinedRaw) {
      const existingPpties = userDefinedRaw.filter(
        (item: any) => item.value !== KEEPR_PPTIES.targetCheckinFrequency
      );
      if (existingPpties.length > 0) {
        updatedUserDefinedPpties = [
          ...existingPpties,
          ...updatedUserDefinedPpties,
        ];
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
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={1}
          sx={{
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Grid size={3}>
            {name}
            {devMode && etag}
            <Button onClick={updateLastCheckinDateToToday} variant="outlined">
              CHECK!
            </Button>
          </Grid>
          <Grid size={3}>
            {targetCheckinFrequency
              ? isCheckinOverdue
                ? overdueRatioFormatter(overdueRatio, diff)
                : remainingDaysUntilCheckinFormatter(diff)
              : "N/A"}
          </Grid>
          <Grid size={3}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <div>{lastCheckin ? lastCheckin.toDateString() : "N/A"}</div>
              {editModeForDate && (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Last checked in"
                    value={lastCheckinInputValue}
                    onChange={(newValue) =>
                      setLastCheckinInputValue(dayjs(newValue))
                    }
                    disableFuture
                  />
                </LocalizationProvider>
              )}
              {editModeForDate ? (
                <>
                  <IconButton
                    onClick={saveDateAndClose}
                    aria-label="edit"
                    color="success"
                  >
                    <Check />
                  </IconButton>
                  {/* TODO ensure exit cancels any changes */}
                  <IconButton
                    onClick={exitDateEdit}
                    aria-label="close"
                    color="error"
                  >
                    <Close />
                  </IconButton>
                </>
              ) : (
                <IconButton
                  onClick={() => setEditModeForDate(true)}
                  aria-label="edit"
                >
                  <Edit />
                </IconButton>
              )}
            </Stack>
          </Grid>
          <Grid size={3}>
            {editModeForTargetFrequency ? (
              <>
                <IconButton
                  onClick={saveTargetFrequencyAndClose}
                  aria-label="edit"
                  color="success"
                >
                  <Check />
                </IconButton>
                <IconButton
                  onClick={exitTargetFrequencyEdit}
                  aria-label="close"
                  color="error"
                >
                  <Close />
                </IconButton>
              </>
            ) : (
              <>
                {targetCheckinFrequency || "unset"}
                <IconButton
                  onClick={() => setEditModeForTargetFrequency(true)}
                  aria-label="edit"
                >
                  <Edit />
                </IconButton>
              </>
            )}
            {editModeForTargetFrequency && (
              <Select
                id="target-frequency"
                value={
                  targetFrequencyInputValue
                    ? targetFrequencyInputValue
                    : "unset"
                }
                onChange={(event) => {
                  setTargetFrequencyInputValue(event.target.value as Frequency);
                }}
                label="frequency"
              >
                <MenuItem value={"unset"}>Unset</MenuItem>
                <MenuItem value={"weekly"}>Weekly</MenuItem>
                <MenuItem value={"fortnightly"}>Fortnightly</MenuItem>r
                <MenuItem value={"monthly"}>Monthly</MenuItem>
                <MenuItem value={"yearly"}>Yearly</MenuItem>
              </Select>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
