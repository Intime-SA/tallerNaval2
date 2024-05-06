import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Typography,
  Grid,
  CircularProgress,
  Divider,
} from "@mui/material";
import { AddCircleOutlined, Delete as DeleteIcon } from "@mui/icons-material";
import { db } from "../../../../firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import useMediaQuery from "@mui/material/useMediaQuery";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

function generate(element) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

const CustomAvatar = styled(Avatar)(({ theme }) => ({
  width: 64,
  height: 64,
  [theme.breakpoints.down("sm")]: {
    width: 48,
    height: 48,
  },
}));

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  width: "320px",
  display: "flex",
  flexDirection: isMobile ? "column" : "row",
}));

export default function ListEmpleado({
  idObra,
  setCambioHoras,
  idCliente,
  arrayEmpleados,
  setArrayEmpleados,
  actualizarEmpleados,
  setOpenProgress,
  openProgress,
  setTotalHorasEmpleado,
}) {
  const [dense, setDense] = useState(false);
  const [secondary, setSecondary] = useState(true);

  const [arrayObras, setArrayObras] = useState([]);
  const [sumaHoras, setSumarHoras] = useState(false);
  const [loadingEmpleados, setLoadingEmpleados] = useState({});

  const isMobile = useMediaQuery("(max-width:760px)");

  useEffect(() => {
    const consultaEmpleados = async () => {
      try {
        const collectionEmpleados = collection(db, "empleados");
        const EmpleadosSnapshot = await getDocs(collectionEmpleados);
        const EmpleadosData = EmpleadosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Id de la obra que estás buscando
        // Supongamos que este es el ID de la obra buscada

        // Filtrar los empleados que tienen la obra activa con el idObra especificado
        const empleadosConObraActiva = EmpleadosData.filter(
          (empleado) =>
            empleado.obrasActivas && empleado.obrasActivas.includes(idObra)
        );

        // Agregar empleados que tienen la obra activa con el idObra especificado al arrayEmpleados
        setArrayEmpleados(empleadosConObraActiva);
      } catch (error) {
        console.error("Error fetching Empleados:", error);
      }
    };

    consultaEmpleados();
  }, [actualizarEmpleados]);

  useEffect(() => {
    const consultaObra = async () => {
      try {
        const collectionObras = collection(db, "obras");
        const ObrasSnapshot = await getDocs(collectionObras);
        const ObrasData = ObrasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Id de la obra que estás buscando
        // Supongamos que este es el ID de la obra buscada

        // Filtrar los Obras que tienen la obra activa con el idObra especificado

        // Agregar Obras que tienen la obra activa con el idObra especificado al arrayObras
        setArrayObras(ObrasData);

        // Apagar la señal de sumaHoras después de cargar los datos
        setSumarHoras(false);
        setCambioHoras(false);
      } catch (error) {
        console.error("Error fetching Obras:", error);
      }
    };

    consultaObra();
  }, [sumaHoras, openProgress]);

  const consultaHoras = (idObra, empleadoId) => {
    const obra = arrayObras.find((obra) => obra.id === idObra);
    if (obra && obra.horasEmpleado && obra.horasEmpleado[empleadoId]) {
      return obra.horasEmpleado[empleadoId];
    }
    return 0;
  };

  const sumarHoras = async (idObra, empleadoId, horas) => {
    setLoadingEmpleados((prevLoadingEmpleados) => ({
      ...prevLoadingEmpleados,
      [empleadoId]: true,
    }));

    setOpenProgress(true);
    console.log(idCliente);
    try {
      // Obtener la referencia de la obra específica
      const obraRef = doc(db, "obras", idObra);
      const obraSnapshot = await getDoc(obraRef);
      const obraData = obraSnapshot.data().horasEmpleado;

      // Verificar si la obra tiene un objeto horasEmpleado
      console.log(obraData);

      // Sumar horas al empleado
      obraData[empleadoId] = (obraData[empleadoId] || 0) + horas;
      console.log(obraData);

      // Actualizar los datos de la obra en la base de datos
      await updateDoc(obraRef, { horasEmpleado: obraData });
      setSumarHoras(true);
      setCambioHoras(true);

      await addDoc(collection(db, "horas"), {
        clienteId: idCliente, // Reemplazar con el ID real del cliente
        empleadoId: empleadoId,
        obraId: idObra,
        fechaCarga: serverTimestamp(),
        fechaHora: serverTimestamp(),
        horas: horas, // O cambiar esto según sea necesario
      });
    } catch (error) {
      console.error("Error al sumar horas:", error);
    }
    setOpenProgress(false);
    setLoadingEmpleados(false);
  };

  const restarHoras = async (idObra, empleadoId, horas) => {
    setLoadingEmpleados((prevLoadingEmpleados) => ({
      ...prevLoadingEmpleados,
      [empleadoId]: true,
    }));

    setOpenProgress(true);
    console.log(idCliente);
    try {
      // Obtener la referencia de la obra específica
      const obraRef = doc(db, "obras", idObra);
      const obraSnapshot = await getDoc(obraRef);
      const obraData = obraSnapshot.data().horasEmpleado;

      // Verificar si la obra tiene un objeto horasEmpleado
      console.log(obraData);

      // Restar horas al empleado
      obraData[empleadoId] = (obraData[empleadoId] || 0) - horas; // Resta las horas
      console.log(obraData);

      // Actualizar los datos de la obra en la base de datos
      await updateDoc(obraRef, { horasEmpleado: obraData });
      setSumarHoras(true); // Establecer la señal de restar horas a true
      setCambioHoras(true);

      await addDoc(collection(db, "horas"), {
        clienteId: idCliente, // Reemplazar con el ID real del cliente
        empleadoId: empleadoId,
        obraId: idObra,
        fechaCarga: serverTimestamp(),
        fechaHora: serverTimestamp(),
        horas: -horas, // Usar un valor negativo para restar horas
      });
    } catch (error) {
      console.error("Error al restar horas:", error);
    }
    setOpenProgress(false);
    setLoadingEmpleados(false);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        maxWidth: 300,
      }}
    >
      <Grid item xs={12} md={6}>
        <Box sx={{ width: isMobile ? "95vw" : "80vw" }}>
          <List
            dense={dense}
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: isMobile ? "center" : "flex-start",
            }}
          >
            {arrayEmpleados.map((empleado) => (
              <ListItem
                sx={{
                  width: isMobile ? "100%" : "300px",
                  padding: "1rem",
                  maxWidth: "90vw",
                  maxHeight: "200px",
                  borderRadius: 8, // Ajusta el valor según tus preferencias
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Agrega una sombra
                  backgroundColor: "#f5f5f5", // Color de fondo sutil
                  marginBottom: "1rem",
                  marginLeft: isMobile ? "0px" : "1rem",
                }}
                key={empleado.id}
              >
                <ListItemAvatar sx={{ paddingBottom: "5rem" }}>
                  <img
                    src={empleado.imagen}
                    alt=""
                    style={{
                      width: "3rem",
                      borderRadius: "50px",
                      height: "3rem",
                    }}
                  />
                </ListItemAvatar>
                <Divider />
                <ListItemText
                  style={{ paddingBottom: "5rem" }}
                  primary={`${empleado.nombre} ${empleado.apellido}`}
                  secondary={secondary ? empleado.telefono : null}
                />
                <ListItemSecondaryAction
                  style={{
                    width: "200px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "3.5rem",
                    marginRight: "1rem",
                  }}
                >
                  <IconButton
                    onClick={() => sumarHoras(idObra, empleado.id, 1)}
                    edge="end"
                    aria-label="delete"
                  >
                    <span class="material-symbols-outlined">
                      exposure_plus_1
                    </span>
                  </IconButton>

                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => sumarHoras(idObra, empleado.id, 8)}
                  >
                    <AddCircleOutlined />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete">
                    {loadingEmpleados[empleado.id] ? (
                      <CircularProgress />
                    ) : (
                      <ListItemText
                        primary={consultaHoras(idObra, empleado.id)}
                      />
                    )}
                  </IconButton>
                  <IconButton
                    onClick={() => restarHoras(idObra, empleado.id, 8)}
                    edge="end"
                    aria-label="delete"
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => restarHoras(idObra, empleado.id, 1)}
                    edge="end"
                    aria-label="delete"
                  >
                    <span class="material-symbols-outlined">
                      exposure_neg_1
                    </span>
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      </Grid>
    </Box>
  );
}
