import React, { useState, useContext } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { TableContext } from "../../context/TableContext";

const EgresoForm = () => {
  const [cuenta, setCuenta] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEgreso, setFechaEgreso] = useState("");
  const [monto, setMonto] = useState("");
  const [numeroComprobante, setNumeroComprobante] = useState("");
  const [proveedor, setProveedor] = useState(null);

  const { proveedores, cuentas } = useContext(TableContext);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Validación del monto
    if (isNaN(monto) || monto === "") {
      alert("Por favor, introduce un valor numérico válido para el monto.");
      return;
    }

    try {
      const nuevoEgreso = {
        cuenta: cuenta.nombre,
        descripcion,
        fechaEgreso: new Date(fechaEgreso),
        monto: Number(monto),
        numeroComprobante,
        proveedorId: proveedor.id,
        tipoComprobante: "transferencia",
      };

      const docRef = await addDoc(collection(db, "egresos"), nuevoEgreso);

      // Limpiar los campos después de agregar el egreso
      setCuenta("");
      setDescripcion("");
      setFechaEgreso("");
      setMonto("");
      setNumeroComprobante("");
      setProveedor(null);

      console.log("Egreso agregado correctamente con ID: ", docRef.id);
    } catch (error) {
      console.error("Error al agregar el egreso:", error);
    }
  };

  const handleMontoChange = (e) => {
    const value = e.target.value;
    // Solo permitir valores numéricos y decimales
    if (/^\d*\.?\d*$/.test(value)) {
      setMonto(value);
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      style={{ maxWidth: "1000px", marginLeft: "5rem" }}
    >
      <Autocomplete
        id="proveedor-select"
        options={proveedores}
        getOptionLabel={(option) => option.nombreComercio}
        onChange={(event, value) => setProveedor(value)}
        value={proveedor}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Seleccionar proveedor"
            variant="outlined"
          />
        )}
      />
      <Autocomplete
        id="cuenta-select"
        options={cuentas}
        getOptionLabel={(option) => option.nombre}
        onChange={(event, value) => setCuenta(value)}
        value={cuenta}
        style={{ marginTop: "1rem" }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Seleccionar Cuenta Origen"
            variant="outlined"
          />
        )}
      />
      <TextField
        label="Descripción"
        variant="outlined"
        fullWidth
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Fecha de Egreso"
        variant="outlined"
        type="datetime-local"
        fullWidth
        value={fechaEgreso}
        onChange={(e) => setFechaEgreso(e.target.value)}
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="Monto"
        variant="outlined"
        fullWidth
        value={monto}
        onChange={handleMontoChange}
        margin="normal"
        inputProps={{
          inputMode: "decimal",
          pattern: "[0-9]*[.,]?[0-9]+",
        }}
      />
      <TextField
        label="Número de Comprobante"
        variant="outlined"
        fullWidth
        value={numeroComprobante}
        onChange={(e) => setNumeroComprobante(e.target.value)}
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Agregar Egreso
      </Button>
    </form>
  );
};

export default EgresoForm;
