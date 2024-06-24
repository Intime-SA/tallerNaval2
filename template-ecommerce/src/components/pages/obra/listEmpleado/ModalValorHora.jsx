import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { db } from "../../../../firebaseConfig";

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

  return (
    <div>
      <Button onClick={handleOpen}>Abrir modal</Button>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-titulo"
        aria-describedby="modal-descripcion"
      >
        <Box sx={style}>
          <Typography id="modal-titulo" variant="h6" component="h2">
            Seleccionar Valor de Hora
          </Typography>
          <Select
            labelId="select-hora-label"
            id="select-hora"
            value={preSeleccion}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value={horaValor.horaEstandar}>Hora Estándar</MenuItem>
            <MenuItem value={horaValor.horaExtra}>Hora Extra</MenuItem>
            <MenuItem value={horaValor.horaFeriado}>Hora Feriado</MenuItem>
            <MenuItem value={horaValor.horaLargaDistancia}>
              Hora Larga Distancia
            </MenuItem>
            <MenuItem value={horaValor.horaTraslado}>Hora Traslado</MenuItem>
          </Select>
          {preSeleccion && (
            <Typography id="modal-descripcion" sx={{ mt: 2 }}>
              Valor de Hora Seleccionado:{" "}
              {preSeleccion.toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })}
            </Typography>
          )}

          {preSeleccion && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirm}
              sx={{ mt: 2 }}
            >
              Confirmar Selección
            </Button>
          )}
        </Box>
      </Modal>
    </div>
  );
}
