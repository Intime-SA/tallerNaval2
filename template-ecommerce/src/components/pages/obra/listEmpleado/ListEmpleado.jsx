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
} from "@mui/material";
import { AddCircleOutlined, Delete as DeleteIcon } from "@mui/icons-material";
import { db } from "../../../../firebaseConfig";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

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
  width: "500px",
}));

export default function ListEmpleado({ idObra, setCambioHoras, idCliente }) {
  const [dense, setDense] = useState(false);
  const [secondary, setSecondary] = useState(true);
  const [arrayEmpleados, setArrayEmpleados] = useState([]);
  const [arrayObras, setArrayObras] = useState([]);
  const [sumaHoras, setSumarHoras] = useState(false);

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
  }, []);

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
  }, [sumaHoras]);

  const consultaHoras = (idObra, empleadoId) => {
    const obra = arrayObras.find((obra) => obra.id === idObra);
    if (obra && obra.horasEmpleado && obra.horasEmpleado[empleadoId]) {
      return obra.horasEmpleado[empleadoId];
    }
    return null;
  };

  const sumarHoras = async (idObra, empleadoId) => {
    console.log(idCliente);
    try {
      // Obtener la referencia de la obra específica
      const obraRef = doc(db, "obras", idObra);
      const obraSnapshot = await getDoc(obraRef);
      const obraData = obraSnapshot.data().horasEmpleado;

      // Verificar si la obra tiene un objeto horasEmpleado
      console.log(obraData);

      // Sumar horas al empleado
      obraData[empleadoId] = (obraData[empleadoId] || 0) + 8;
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
        horas: 8, // O cambiar esto según sea necesario
      });
    } catch (error) {
      console.error("Error al sumar horas:", error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 1052 }}>
      <Grid item xs={12} md={6}>
        <Demo>
          <List dense={dense}>
            {arrayEmpleados.map((empleado) => (
              <ListItem key={empleado.id}>
                <ListItemAvatar>
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
                <ListItemText
                  primary={`${empleado.nombre} ${empleado.apellido}`}
                  secondary={secondary ? empleado.telefono : null}
                />
                <ListItemSecondaryAction
                  style={{
                    width: "150px",
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => sumarHoras(idObra, empleado.id)}
                  >
                    <AddCircleOutlined />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete">
                    <ListItemText
                      primary={consultaHoras(idObra, empleado.id)}
                    />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Demo>
      </Grid>
    </Box>
  );
}
