import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { db } from "../../../../firebaseConfig";
import { TextField } from "@mui/material";
import DatePickerComponent from "./DatePickerComponent";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ModalHoraValor({
  openModal,
  setOpenModal,
  setSelectedHora,
  selectedHora,
  horaValor,
  setTipoHora,
  setFechaHora,
  fechaHora,
  setHoraEdit,
  horaEdit,
}) {
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const [preSeleccion, setPreSeleccion] = useState(null);

  const handleChange = (event) => {
    const selectedValue = event.target.value; // Valor seleccionado desde el Select
    setPreSeleccion(selectedValue); // Guardar el valor seleccionado en el estado local

    // Determinar el tipo de hora seleccionado y pasarlo a setTipoHora
    let tipoHoraSeleccionado = ""; // Inicializar variable para guardar el tipo de hora

    // Determinar el tipo de hora seleccionado
    if (selectedValue === horaValor.horaEstandar) {
      tipoHoraSeleccionado = "horaEstandar";
    } else if (selectedValue === horaValor.horaExtra) {
      tipoHoraSeleccionado = "horaExtra";
    } else if (selectedValue === horaValor.horaFeriado) {
      tipoHoraSeleccionado = "horaFeriado";
    } else if (selectedValue === horaValor.horaLargaDistancia) {
      tipoHoraSeleccionado = "horaLargaDistancia";
    } else if (selectedValue === horaValor.horaTraslado) {
      tipoHoraSeleccionado = "horaTraslado";
    }

    // Llamar a setTipoHora con el tipoHoraSeleccionado
    setTipoHora(tipoHoraSeleccionado);
  };

  const handleConfirm = () => {
    setSelectedHora(preSeleccion);
    console.log(`Valor de hora seleccionado: ${selectedHora}`);
    handleClose();
    setPreSeleccion(null);
  };

  const [displayValue, setDisplayValue] = useState("");

  const handleChangeHora = (event) => {
    const { value } = event.target;
    if (/^\d*\.?\d{0,1}$/.test(value)) {
      setDisplayValue(value);
      setHoraEdit(value === "" ? null : parseFloat(value));
    }
  };

  console.log(horaEdit);

  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-titulo"
        aria-describedby="modal-descripcion"
      >
        <Box sx={style}>
          <Typography
            style={{ fontFamily: '"Kanit", sans-serif' }}
            id="modal-titulo"
            variant="h6"
            component="h2"
          >
            Seleccionar Valor de Hora
          </Typography>
          <Select
            labelId="select-hora-label"
            id="select-hora"
            value={preSeleccion}
            onChange={handleChange}
            fullWidth
            style={{ fontFamily: '"Kanit", sans-serif' }}
          >
            <MenuItem
              style={{ fontFamily: '"Kanit", sans-serif' }}
              value={horaValor.horaEstandar}
            >
              Hora Estándar
            </MenuItem>
            <MenuItem
              style={{ fontFamily: '"Kanit", sans-serif' }}
              value={horaValor.horaExtra}
            >
              Hora Extra
            </MenuItem>
            <MenuItem
              style={{ fontFamily: '"Kanit", sans-serif' }}
              value={horaValor.horaFeriado}
            >
              Hora Feriado
            </MenuItem>
            <MenuItem
              style={{ fontFamily: '"Kanit", sans-serif' }}
              value={horaValor.horaLargaDistancia}
            >
              Hora Larga Distancia
            </MenuItem>
            <MenuItem
              style={{ fontFamily: '"Kanit", sans-serif' }}
              value={horaValor.horaTraslado}
            >
              Hora Traslado
            </MenuItem>
          </Select>
          {preSeleccion && (
            <div>
              <Typography
                style={{ fontFamily: '"Kanit", sans-serif' }}
                id="modal-descripcion"
                sx={{ mt: 2 }}
              >
                Valor de Hora Seleccionado:{" "}
                {preSeleccion.toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </Typography>
              <Typography
                style={{ fontFamily: '"Kanit", sans-serif' }}
                id="modal-descripcion"
                sx={{ mt: 2 }}
              >
                Total:{" "}
                {(preSeleccion * horaEdit).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </Typography>
            </div>
          )}

          <DatePickerComponent
            setFechaHora={setFechaHora}
            fechaHora={fechaHora}
          />
          <TextField
            id="filled-basic"
            label="Cantidad Horas"
            variant="filled"
            value={displayValue}
            onChange={handleChangeHora}
            inputProps={{ inputMode: "decimal", pattern: "[0-9]*[.,]?[0-9]?" }}
            style={{ marginTop: "1rem" }}
          />

          {preSeleccion && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirm}
              sx={{ mt: 2, fontFamily: '"Kanit", sans-serif' }}
            >
              Confirmar Selección
            </Button>
          )}
        </Box>
      </Modal>
    </div>
  );
}
