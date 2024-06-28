import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db, uploadFile } from "../../../firebaseConfig";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";

const AgregarEmpleado = () => {
  const [apellido, setApellido] = useState("");
  const [nombre, setNombre] = useState("");
  const [fechaAlta, setFechaAlta] = useState("");
  const [imagen, setImagen] = useState("");
  const [obrasActivas, setObrasActivas] = useState([]);
  const [telefono, setTelefono] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  const navigate = useNavigate();

  const handleAddEmpleado = async (e) => {
    e.preventDefault();
    try {
      const nuevoEmpleado = {
        apellido,
        nombre,
        fechaAlta: new Date(fechaAlta),
        imagen,
        telefono,
      };

      await addDoc(collection(db, "empleados"), nuevoEmpleado);

      // Limpiar los campos después de agregar el empleado
      setApellido("");
      setNombre("");
      setFechaAlta("");
      setImagen("");
      setTelefono("");

      console.log("Empleado agregado correctamente");
      navigate("/"); // Redirigir a la lista de empleados
    } catch (error) {
      console.error("Error al agregar el empleado:", error);
    }
  };

  const handleImage = async () => {
    setIsLoading(true);

    // Subir la imagen comprimida a Firebase
    const url = await uploadFile(file);
    setImagen(url);
    setIsLoading(false);
    setIsImageUploaded(true);
  };

  return (
    <div style={{ marginLeft: "16.5rem", marginTop: "2rem", width: "80%" }}>
      <Typography
        variant="h6"
        gutterBottom
        style={{ fontFamily: '"Kanit", sans-serif' }}
      >
        Agregar Nuevo Empleado
      </Typography>
      <form onSubmit={handleAddEmpleado}>
        <TextField
          label="Apellido"
          variant="outlined"
          fullWidth
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: {
              fontFamily: '"Kanit", sans-serif',
            },
          }}
        />
        <TextField
          label="Nombre"
          variant="outlined"
          fullWidth
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: {
              fontFamily: '"Kanit", sans-serif',
            },
          }}
        />
        <TextField
          label="Fecha de Alta"
          variant="outlined"
          type="datetime-local"
          fullWidth
          value={fechaAlta}
          onChange={(e) => setFechaAlta(e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: {
              fontFamily: '"Kanit", sans-serif',
            },
          }}
        />

        <TextField
          label="Teléfono"
          variant="outlined"
          fullWidth
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: {
              fontFamily: '"Kanit", sans-serif',
            },
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between", // Esto distribuirá los elementos a lo largo del contenedor
            marginTop: "1rem",
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: "none" }}
            id="fileInput"
          />
          <label htmlFor="fileInput" style={{ marginRight: "8px" }}>
            <Button
              style={{ fontFamily: '"Kanit", sans-serif' }}
              variant="contained"
              component="span"
            >
              Cargar Imagen
            </Button>
          </label>
          {file && (
            <Button
              variant="contained"
              onClick={handleImage}
              disabled={isLoading}
              style={{
                marginRight: "8px",
                fontFamily: '"Kanit", sans-serif',
              }}
            >
              {isLoading ? "Cargando..." : "Subir Imagen"}
            </Button>
          )}
          {isImageUploaded && (
            <Button
              style={{ fontFamily: '"Kanit", sans-serif' }}
              type="submit"
              variant="contained"
              color="success"
            >
              Agregar Empleado
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AgregarEmpleado;
