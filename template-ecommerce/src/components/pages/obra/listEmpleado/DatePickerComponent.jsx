import * as React from "react";
import dayjs from "dayjs";
import "dayjs/locale/es"; // Importa el idioma
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const DatePickerComponent = ({ setFechaHora, fechaHora }) => {
  const handleDateChange = (newValue) => {
    setFechaHora(newValue);
  };

  console.log(fechaHora);

  return (
    <DemoContainer
      size="small"
      sx={{ display: "flex", alignItems: "center" }}
      components={["DatePicker"]}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <DemoContainer components={["DatePicker"]}>
          <DatePicker
            label="Fecha Comprobante"
            value={fechaHora}
            onChange={handleDateChange}
          />
        </DemoContainer>
      </LocalizationProvider>
    </DemoContainer>
  );
};

export default DatePickerComponent;
