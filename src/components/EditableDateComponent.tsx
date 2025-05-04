import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import Edit from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";

interface EditableDateComponentProps {
  dateValue: Dayjs;
  setDate: Function;
}

export default function EditableDateComponent({
  dateValue,
  setDate,
}: EditableDateComponentProps) {
  return (
    <>
      {/* <div>{lastCheckin ? lastCheckin.toDateString() : "N/A"}</div> */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          // label="Last checked in"
          value={dateValue}
          onChange={(newValue) => {
            setDate(dayjs(newValue));
          }}
          disableFuture
        />
      </LocalizationProvider>
    </>
  );
}
