import React, { useState, useContext, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { collection, addDoc, runTransaction, doc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { TableContext } from "../../context/TableContext";

const EgresoForm = () => {
  const [cuenta, setCuenta] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEgreso, setFechaEgreso] = useState("");
  const [monto, setMonto] = useState("");
  const [numeroComprobante, setNumeroComprobante] = useState("");
  const [proveedor, setProveedor] = useState(null);
  const [tipoComprobante, setTipoComprobante] = useState("");
  const [numberOrder, setNumberOrder] = useState();
  const [montoFormateado, setMontoFormateado] = useState(0);

  const [errors, setErrors] = useState({});

  const { proveedores, cuentas } = useContext(TableContext);

  useEffect(() => {
    const traerId = async () => {
      try {
        const refContador = doc(db, "contador", "contadorIngreso");

        await runTransaction(db, async (transaction) => {
          const docContador = await transaction.get(refContador);
          const nuevoValor = docContador.data().autoincremental + 1;

          transaction.update(refContador, { autoincremental: nuevoValor });
          setNumberOrder(nuevoValor);
        });
      } catch (error) {
        console.error("Error al obtener el nuevo ID:", error);
      }
    };

    traerId();
  }, []);

  const validate = () => {
    let tempErrors = {};

    if (!cuenta) tempErrors.cuenta = "Este campo es obligatorio.";
    if (!descripcion) tempErrors.descripcion = "Este campo es obligatorio.";
    if (!fechaEgreso) tempErrors.fechaEgreso = "Este campo es obligatorio.";
    if (!monto || isNaN(monto))
      tempErrors.monto =
        "Por favor, introduce un valor numérico válido para el monto.";
    if (!numeroComprobante)
      tempErrors.numeroComprobante = "Este campo es obligatorio.";
    if (!proveedor) tempErrors.proveedor = "Este campo es obligatorio.";
    if (!tipoComprobante)
      tempErrors.tipoComprobante = "Este campo es obligatorio.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Validación del monto

    try {
      const nuevoEgreso = {
        numberOrder: numberOrder,
        cuenta: cuenta.id,
        descripcion,
        fechaEgreso: new Date(fechaEgreso),
        monto: Number(monto),
        numeroComprobante,
        proveedorId: proveedor.id,
        tipoComprobante: tipoComprobante.id,
      };

      const docRef = await addDoc(collection(db, "egresos"), nuevoEgreso);

      // Limpiar los campos después de agregar el egreso
      setCuenta("");
      setDescripcion("");
      setFechaEgreso("");
      setMonto("");
      setNumeroComprobante("");
      setProveedor(null);
      setTipoComprobante("");

      console.log("Egreso agregado correctamente con ID: ", docRef.id);
      window.location.reload();
    } catch (error) {
      console.error("Error al agregar el egreso:", error);
    }
  };

  const handleMontoChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Elimina cualquier carácter no numérico
    if (/^\d*\.?\d*$/.test(value)) {
      const numericValue = Number(value); // Convertir a número
      setMonto((numericValue / 100).toFixed(2)); // Almacenar el número con dos decimales

      // Formatear el número sin símbolo de moneda
      const formateador = new Intl.NumberFormat("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      setMontoFormateado(formateador.format(numericValue / 100)); // Formatear el valor numérico
    }
  };

  const handleInput = (e) => {
    e.target.value = e.target.value.replace(/[$.,]/g, "");
  };

  const tipos = [{ id: "Efectivo" }, { id: "Transferencia" }, { id: "Cheque" }];

  return (
    <form
      onSubmit={handleFormSubmit}
      style={{ maxWidth: "1000px", marginLeft: "1rem", marginTop: "1.5rem" }}
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
        value={cuenta.id}
        style={{ marginTop: "1rem" }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Seleccionar Cuenta Origen"
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
        id="monto"
        label="Monto"
        value={montoFormateado}
        variant="outlined"
        fullWidth
        onChange={handleMontoChange}
        onInput={handleInput} // Validar entrada
        margin="normal"
        error={!!errors.monto}
        helperText={errors.monto}
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
