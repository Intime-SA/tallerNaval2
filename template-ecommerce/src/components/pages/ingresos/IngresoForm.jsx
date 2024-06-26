import React, { useState, useContext } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { TableContext } from "../../context/TableContext";

const IngresoForm = () => {
  const [cuenta, setCuenta] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [monto, setMonto] = useState("");
  const [numeroComprobante, setNumeroComprobante] = useState("");
  const [cliente, setCliente] = useState(null);
  const [tipoComprobante, setTipoComprobante] = useState("");

  const { clientes, cuentas } = useContext(TableContext);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Validación del monto
    if (isNaN(monto) || monto === "") {
      alert("Por favor, introduce un valor numérico válido para el monto.");
      return;
    }

    try {
      const nuevoIngreso = {
        cuenta: cuenta.id,
        descripcion,
        fechaIngreso: new Date(fechaIngreso),
        monto: Number(monto),
        numeroComprobante,
        clienteId: cliente.id,
        tipoComprobante: tipoComprobante.id,
      };

      const docRef = await addDoc(collection(db, "ingresos"), nuevoIngreso);

      // Limpiar los campos después de agregar el ingreso
      setCuenta("");
      setDescripcion("");
      setFechaIngreso("");
      setMonto("");
      setNumeroComprobante("");
      setCliente(null);
      setTipoComprobante("");

      console.log("Ingreso agregado correctamente con ID: ", docRef.id);
    } catch (error) {
      console.error("Error al agregar el ingreso:", error);
    }
  };

  const handleMontoChange = (e) => {
    const value = e.target.value;
    // Solo permitir valores numéricos y decimales
    if (/^\d*\.?\d*$/.test(value)) {
      setMonto(value);
    }
  };

  const tipos = [{ id: "Efectivo" }, { id: "Transferencia" }, { id: "Cheque" }];

  return (
    <form
      onSubmit={handleFormSubmit}
      style={{ maxWidth: "1000px", marginLeft: "1rem", marginTop: "2rem" }}
    >
      <Autocomplete
        id="cliente-select"
        options={clientes}
        getOptionLabel={(option) => option.nombre}
        onChange={(event, value) => setCliente(value)}
        value={cliente}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Seleccionar Cliente"
            variant="outlined"
          />
        )}
      />
      <Autocomplete
        id="cuenta-select"
        options={cuentas}
        getOptionLabel={(option) => option.nombre}
        onChange={(event, value) => setCuenta(value)}
        value={cuenta.id}
        style={{ marginTop: "1rem" }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Seleccionar Cuenta Ingreso"
            variant="outlined"
          />
        )}
      />
      <Autocomplete
        id="tipo-select"
        options={tipos}
        getOptionLabel={(tipo) => tipo.id}
        onChange={(event, value) => setTipoComprobante(value)}
        value={tipoComprobante.id}
        style={{ marginTop: "1rem" }}
        renderInput={(params) => (
          <TextField {...params} label="Tipo de Pago" variant="outlined" />
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
        label="Fecha de Ingreso"
        variant="outlined"
        type="datetime-local"
        fullWidth
        value={fechaIngreso}
        onChange={(e) => setFechaIngreso(e.target.value)}
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
        Agregar Ingreso
      </Button>
    </form>
  );
};

export default IngresoForm;
