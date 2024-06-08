import * as React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { db } from "../../../firebaseConfig";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
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
  // Estado para almacenar los valores del formulario
  const [cliente, setCliente] = React.useState(null);
  const [clientes, setClientes] = React.useState([]);
  const [descripcion, setDescripcion] = React.useState("");
  const [lugar, setLugar] = React.useState("");
  const distancias = [
    { nombre: "Larga Distancia", value: "larga" },
    { nombre: "Corta Distancia", value: "corta" },
  ];

  const [presupuestoInicial, setPresupuestoInicial] = React.useState("");
  const [distancia, setDistancia] = React.useState(distancias[1]);
  const [presupuestoFormateado, setPresupuestoFormateado] = React.useState("");

  const handleClose = () => setOpenModalObra(false);

  React.useEffect(() => {
    const fetchClients = async () => {
      const collectionClientes = collection(db, "clientes");
      const snapshotClientes = await getDocs(collectionClientes);
      let arrayClients = [];
      snapshotClientes.forEach((client) => {
        arrayClients.push({ id: client.id, ...client.data() });
      });
      setClientes(arrayClients);
    };
    fetchClients();
  }, []);

  console.log(clientes);

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
        distancia,
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

  const formatCurrency = (value) => {
    if (value === "") return "";

    // Eliminar todos los caracteres excepto los números y la coma decimal
    value = value.replace(/[^\d]/g, "");

    // Agregar puntos como separadores de miles
    return "$" + value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Función para manejar el cambio en el campo de texto del presupuesto
  const handlePresupuestoChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, ""); // Solo números
    setPresupuestoInicial(rawValue); // Guardar el valor numérico en el estado
    setPresupuestoFormateado(formatCurrency(rawValue)); // Guardar el valor formateado en el estado
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
              label="Descripcion"
              multiline
              rows={6}
              defaultValue="Default Value"
              fullWidth
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              margin="normal"
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
            <Autocomplete
              id="distancia-autocomplete"
              options={distancias}
              label="Zona"
              getOptionLabel={(option) => option.nombre}
              value={distancia}
              onChange={(event, newValue) => {
                setDistancia(newValue ? newValue : "corta");
              }}
              renderInput={(params) => (
                <TextField {...params} label="Zona" fullWidth />
              )}
            />
            <TextField
              id="presupuestoInicial"
              label="Presupuesto Inicial"
              variant="outlined"
              fullWidth
              margin="normal"
              value={presupuestoFormateado}
              onChange={handlePresupuestoChange}
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
