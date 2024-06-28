import React, { useEffect, useState } from "react";
import { TextField, Button, ThemeProvider, createTheme } from "@mui/material";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const theme = createTheme({
  typography: {
    fontFamily: '"Kanit", sans-serif',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label": {
            fontFamily: '"Kanit", sans-serif',
          },
          "& input": {
            fontFamily: '"Kanit", sans-serif',
          },
          "& .MuiInputBase-root": {
            fontFamily: '"Kanit", sans-serif',
          },
          "& .MuiFormHelperText-root": {
            fontFamily: '"Kanit", sans-serif',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Kanit", sans-serif',
        },
      },
    },
  },
});

const AdministracionAjustes = () => {
  const [ajustes, setAjustes] = useState([]);
  const [nuevosAjustes, setNuevosAjustes] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "ajustes"));
      const ajustesData = [];
      querySnapshot.forEach((doc) => {
        ajustesData.push({ id: doc.id, ...doc.data() });
      });
      setAjustes(ajustesData);
    };

    fetchData();
  }, []);

  const formatCurrency = (value) => {
    const stringValue = String(value);
    return parseFloat(stringValue).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    });
  };

  const handleChange = (index, field, value) => {
    const updatedAjustes = { ...nuevosAjustes };
    if (!updatedAjustes[index]) {
      updatedAjustes[index] = {};
    }
    const numericValue = Number(value.replace(/[$%,.]/g, ""));
    updatedAjustes[index][field] = numericValue;
    setNuevosAjustes(updatedAjustes);
  };

  const handleInput = (e) => {
    e.target.value = e.target.value.replace(/[$.,]/g, "");
  };

  const handleSubmit = async () => {
    try {
      for (const index in nuevosAjustes) {
        const ajuste = nuevosAjustes[index];
        const docRef = doc(db, "ajustes", ajustes[index].id);
        await updateDoc(docRef, ajuste);
        window.location.reload();
      }
      alert("Datos actualizados correctamente");
    } catch (error) {
      console.error("Error actualizando los datos: ", error);
      alert("Error actualizando los datos");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ marginTop: "0rem", marginLeft: "16.5rem" }}>
        <h4 style={{ fontFamily: '"Kanit", sans-serif' }}>
          Administracion de Ajustes
        </h4>
        {ajustes.map((ajuste, index) => (
          <div key={index}>
            <div style={{ margin: "1rem" }}>
              <TextField
                id={`horaEstandar_${index}`}
                label="Hora Estándar"
                defaultValue={formatCurrency(ajuste.horaEstandar || 0)}
                helperText="Costo de la hora estándar"
                variant="standard"
                onChange={(e) =>
                  handleChange(index, "horaEstandar", e.target.value)
                }
                onInput={handleInput}
              />
            </div>
            <div style={{ margin: "1rem" }}>
              <TextField
                id={`horaExtra_${index}`}
                label="Hora Extra"
                defaultValue={formatCurrency(ajuste.horaExtra || 0)}
                helperText="Costo de la hora extra"
                variant="standard"
                onChange={(e) =>
                  handleChange(index, "horaExtra", e.target.value)
                }
                onInput={handleInput}
              />
            </div>
            <div style={{ margin: "1rem" }}>
              <TextField
                id={`horaFeriado_${index}`}
                label="Hora Feriado"
                defaultValue={formatCurrency(ajuste.horaFeriado || 0)}
                helperText="Costo de la hora en días feriados"
                variant="standard"
                onChange={(e) =>
                  handleChange(index, "horaFeriado", e.target.value)
                }
                onInput={handleInput}
              />
            </div>
            <div style={{ margin: "1rem" }}>
              <TextField
                id={`horaLargaDistancia_${index}`}
                label="Hora Larga Distancia"
                defaultValue={formatCurrency(ajuste.horaLargaDistancia || 0)}
                helperText="Costo de la hora para largas distancias"
                variant="standard"
                onChange={(e) =>
                  handleChange(index, "horaLargaDistancia", e.target.value)
                }
                onInput={handleInput}
              />
            </div>
            <div style={{ margin: "1rem" }}>
              <TextField
                id={`horaTraslado_${index}`}
                label="Hora Traslado"
                defaultValue={formatCurrency(ajuste.horaTraslado || 0)}
                helperText="Costo de la hora de traslado"
                variant="standard"
                onChange={(e) =>
                  handleChange(index, "horaTraslado", e.target.value)
                }
                onInput={handleInput}
              />
            </div>
          </div>
        ))}
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Guardar Cambios
        </Button>
      </div>
    </ThemeProvider>
  );
};

export default AdministracionAjustes;
