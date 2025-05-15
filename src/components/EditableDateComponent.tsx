import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface EditableDateComponentProps {
  dateValue: Dayjs | null;
  setDate: (date: Dayjs | null) => void;
}

export default function EditableDateComponent({
  dateValue,
  setDate,
}: EditableDateComponentProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={dateValue}
        onChange={(newValue) => {
          setDate(dayjs(newValue));
        }}
        disableFuture
      />
    </LocalizationProvider>
  );
}
