import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import AutoComplete from "./AutoComplete";
import { db } from "../../../../firebaseConfig"; // Importa las funciones de Firebase necesarias
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import AutoCompleteCategory from "./AutocompleteCategory";
import AutoCompleteProveedor from "./AutocompleteProveedor";
import { Height } from "@mui/icons-material";
import { TextField } from "@mui/material";

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
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
};

export default function ModalComponentGasto({
  openModalGasto,
  setOpenModalGasto,
  idObra,
  idCliente,
  setCambioGastos,
}) {
  const handleClose = () => setOpenModalGasto(false);

  const [categoria, setCategoria] = React.useState("");
  const [proveedor, setProveedor] = React.useState("");
  const [descripcion, setDescripcion] = React.useState("");
  const [monto, setMonto] = React.useState(0);

  console.log(idObra);
  // Función para cargar el empleado en la obra
  const cargaGastoObra = async () => {
    try {
      // Validar la existencia de las propiedades requeridas
      if (
        !categoria ||
        !proveedor ||
        !descripcion ||
        isNaN(parseFloat(monto))
      ) {
        console.error("Faltan datos requeridos para cargar el gasto.");
        return;
      }

      // Crear objeto de gasto
      const gasto = {
        obraId: idObra,
        fechaCarga: serverTimestamp(),
        fechaGasto: serverTimestamp(),
        clienteId: idCliente,
        categoria: categoria,
        proveedorId: proveedor,
        descripcion: descripcion,
        gastoGlobal: false,
        gastoObra: true,
        importe: parseFloat(monto),
      };

      // Agregar el objeto de gasto a la colección de Firebase
      const gastoDocRef = await addDoc(collection(db, "gastos"), gasto);

      // Obtener el ID del gasto recién creado
      const gastoId = gastoDocRef.id;

      // Actualizar el documento de la obra para agregar el ID del gasto al array correspondiente
      const obraDocRef = doc(db, "obras", idObra);
      await updateDoc(obraDocRef, {
        [`gastos.${categoria}`]: arrayUnion(gastoId),
      });

      // Cerrar el modal después de cargar el gasto
      setCambioGastos(true);
      setOpenModalGasto(false);
    } catch (error) {
      console.error("Error al cargar el gasto en la obra:", error);
    }
  };

  return (
    <div>
      <Modal
        open={openModalGasto}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h5 style={{ margin: "1rem" }}>Crear gasto:</h5>
          <AutoCompleteCategory
            setCategoria={setCategoria}
            categoria={categoria}
          />
          <AutoCompleteProveedor
            setProveedor={setProveedor}
            proveedor={proveedor}
          />
          <TextField
            id="standard-basic"
            label="Descripción"
            variant="standard"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <TextField
            id="standard-basic"
            label="Monto"
            variant="standard"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
          <Button onClick={() => cargaGastoObra()}>CARGAR GASTO</Button>
          <Button onClick={handleClose}>CERRAR</Button>
        </Box>
      </Modal>
    </div>
  );
}
