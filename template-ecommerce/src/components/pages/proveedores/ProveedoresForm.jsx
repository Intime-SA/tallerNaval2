import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { db } from "../../../firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const ProveedoresForm = ({ customers, setOpenForm, openForm }) => {
  const [newClient, setNewClient] = useState({
    nombre: "",
    email: "",
    telefono: "",
    imagen: "",
    datosFiscales: {
      direccion: "",
      numero: "",
      pisoDpto: "",
      codigoPostal: "",
      barrio: "",
      ciudad: "",
      provincia: "",
    },
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("datosFiscales")) {
      // Si el campo pertenece a datos de envío, actualiza el estado nested
      const nestedName = name.split(".")[1];
      setNewClient({
        ...newClient,
        datosFiscales: {
          ...newClient.datosFiscales,
          [nestedName]: value,
        },
      });
    } else {
      // Si es un campo normal, actualiza el estado como antes
      setNewClient({ ...newClient, [name]: value });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si el correo electrónico ya está en uso
    const emailExists = customers.some(
      (client) => client.email === newClient.email
    );
    if (emailExists) {
      setErrors({ email: "Este email ya está en uso." });
      return;
    }

    // Validar campos obligatorios
    const requiredFields = ["nombre", "email", "datosFiscales"];
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!newClient[field]) {
        newErrors[field] = `El ${field} es requerido.`;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Agregar el nuevo cliente a la base de datos
    const obj = {
      ...newClient,
      fechaInicio: serverTimestamp(),
    };
    const usersCollection = collection(db, "clientes");
    await addDoc(usersCollection, obj);
    setOpenForm(false);

    // Restablecer el formulario después de enviar
    setNewClient({
      nombre: "",
      email: "",
      telefono: "",
      imagen: "",
      datosFiscales: {
        direccion: "",
        numero: "",
        pisoDpto: "",
        codigoPostal: "",
        barrio: "",
        ciudad: "",
        provincia: "",
      },
    });
  };

  const handleReturn = () => {
    setOpenForm(false);
  };

  return (
    <div style={{ width: "100%", zoom: "0.9" }}>
      <h5 style={{ marginTop: "1rem" }}>Agregar Cliente</h5>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "1rem",
          marginBottom: "1rem",
          backgroundColor: "rgba(255, 255, 255, 0.4)",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          {/* Sección de Datos de Cliente */}
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "1rem",
              marginBottom: "0.5rem",
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              width: "100%",
            }}
          >
            <h5 style={{ margin: "1rem", marginBottom: "2rem" }}>
              Datos de Cliente
            </h5>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <TextField
                name="nombre"
                variant="outlined"
                label="Nombre"
                value={newClient.nombre}
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "50%",
                  maxWidth: "200px",
                }}
                InputLabelProps={{ shrink: true }}
                error={!!errors.nombre}
                helperText={errors.nombre}
              />
              {/*               <TextField
                name="apellido"
                variant="outlined"
                label="Apellido"
                value={newClient.apellido}
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "50%",
                  maxWidth: "200px",
                }}
                InputLabelProps={{ shrink: true }}
                error={!!errors.apellido}
                helperText={errors.apellido}
              /> */}

              <TextField
                name="email"
                variant="outlined"
                label="Correo electrónico"
                value={newClient.email}
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  maxWidth: "400px",
                }}
                InputLabelProps={{ shrink: true }}
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                name="telefono"
                variant="outlined"
                label="Telefono"
                value={newClient.telefono}
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  maxWidth: "400px",
                }}
                InputLabelProps={{ shrink: true }}
                error={!!errors.telefono}
                helperText={errors.telefono}
              />
              <TextField
                name="datosFiscales.cuit"
                variant="outlined"
                label="CUIT"
                value={newClient.datosFiscales.cuit}
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "50%",
                  maxWidth: "200px",
                }}
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </div>

          {/* Sección de Datos de Envío */}
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "1rem",
              marginBottom: "0.5rem",
              backgroundColor: "rgba(255, 255, 255, 0.4)",
            }}
          >
            <h5
              style={{
                marginTop: "0rem",
                marginBottom: "2rem",
                marginLeft: "1rem",
              }}
            >
              Datos Fiscales
            </h5>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <TextField
                name="datosFiscales.direccion"
                variant="outlined"
                label="direccion"
                value={newClient.datosFiscales.direccion}
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  maxWidth: "400px",
                }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="datosFiscales.numero"
                variant="outlined"
                label="Número"
                value={newClient.datosFiscales.numero}
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "50%",
                  maxWidth: "200px",
                }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="datosFiscales.pisoDpto"
                variant="outlined"
                label="Piso/Dpto"
                value={newClient.datosFiscales.pisoDpto}
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "50%",
                  maxWidth: "200px",
                }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="datosFiscales.cp"
                variant="outlined"
                label="Código Postal"
                value={newClient.datosFiscales.cp}
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "50%",
                  maxWidth: "200px",
                }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="datosFiscales.barrio"
                variant="outlined"
                label="Barrio"
                value={newClient.datosFiscales.barrio}
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  maxWidth: "400px",
                }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="datosFiscales.ciudad"
                variant="outlined"
                label="Ciudad"
                value={newClient.datosFiscales.ciudad}
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  maxWidth: "400px",
                }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="datosFiscales.provincia"
                variant="outlined"
                label="Provincia"
                value={newClient.datosFiscales.provincia}
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  maxWidth: "400px",
                }}
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginBottom: "1rem", width: "50%", maxWidth: "200px" }}
          >
            Cargar Cliente
          </Button>
        </form>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={handleReturn}>
          Volver
        </Button>
      </div>
    </div>
  );
};

export default ProveedoresForm;
