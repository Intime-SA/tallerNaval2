import * as React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { db } from "../../../firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Height } from "@mui/icons-material";
import "./ModalObra.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: "100vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ModalObra({
  openModalObra,
  setOpenModalObra,
  setActualizarObras,
}) {
  const handleClose = () => setOpenModalObra(false);

  // Datos iniciales para el autocompletar de clientes (puedes reemplazarlos con los datos reales)
  const clientes = [
    { id: "Eg8yh40v1iI0I1RykvSu", nombre: "Cliente 1" },
    // Agrega más clientes según sea necesario
  ];

  // Estado para almacenar los valores del formulario
  const [cliente, setCliente] = React.useState(null);
  const [descripcion, setDescripcion] = React.useState("");
  const [lugar, setLugar] = React.useState("");
  const [presupuestoInicial, setPresupuestoInicial] = React.useState("");
  const [presupuestoActual, setPresupuestoActual] = React.useState("");

  // Función para manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Crear un objeto con los datos del formulario
      const nuevaObra = {
        cliente,
        descripcion,
        estado: "enProceso",
        lugar,
        presupuestoInicial: parseFloat(presupuestoInicial),
        presupuestoActual: 0,
        gastos: [],
        horasEmpleado: {},
        fechaInicio: serverTimestamp(),
      };

      // Agregar la obra a la colección "obras" en Firestore
      await addDoc(collection(db, "obras"), nuevaObra);
      console.log(nuevaObra);
      setActualizarObras(true);

      // Cerrar el modal
      handleClose();
    } catch (error) {
      console.error("Error al agregar la obra:", error);
    }
  };

  return (
    <div>
      <Modal
        open={openModalObra}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h1 className="bebas-neue-regular">Crear Obra</h1>
          <form onSubmit={handleSubmit}>
            <Autocomplete
              id="cliente-autocomplete"
              options={clientes}
              getOptionLabel={(option) => option.nombre}
              value={clientes.find((option) => option.id === cliente)}
              onChange={(event, newValue) => {
                setCliente(newValue ? newValue.id : null);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Cliente" fullWidth />
              )}
            />
            <TextField
              id="descripcion"
              label="Descripción"
              variant="outlined"
              fullWidth
              margin="normal"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
            <TextField
              id="lugar"
              label="Lugar"
              variant="outlined"
              fullWidth
              margin="normal"
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
            />
            <TextField
              id="presupuestoInicial"
              label="Presupuesto Inicial"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={presupuestoInicial}
              onChange={(e) => setPresupuestoInicial(e.target.value)}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                onClick={handleClose}
                color="secondary"
                variant="outlined"
              >
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="success">
                Crear Obra
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
