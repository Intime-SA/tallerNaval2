import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { DrawerContext } from "../../context/DrawerContext";
import { TableContext } from "../../context/TableContext";

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date.seconds * 1000);
  return d.toLocaleDateString("es-ES"); // Formato DD/MM/YYYY para el idioma español
}

function Row(props) {
  const { row, tiposHora, empleados } = props;
  const [open, setOpen] = useState(false);

  console.log(row.details);

  const getNombrecliente = (idcliente) => {
    const cliente = empleados.find((cat) => cat.id === idcliente);
    return cliente ? cliente.nombre + " " + cliente.apellido : "Desconocida";
  };
  const totalEmpleadoObra = row.details.reduce((total, detail) => {
    if (detail.horas > 0 && detail.valorHora > 0) {
      // Ambos positivos
      return total + detail.horas * detail.valorHora;
    } else if (detail.horas < 0 && detail.valorHora < 0) {
      // Ambos negativos
      return total - Math.abs(detail.horas) * Math.abs(detail.valorHora);
    } else {
      // Uno positivo y otro negativo
      return total + detail.horas * detail.valorHora;
    }
  }, 0);

  console.log(totalEmpleadoObra);

  const removeWordHora = (tipoHora) => {
    return tipoHora.replace(/hora/gi, "").trim(); // Eliminamos "hora" independientemente de su ubicación en la cadena y luego quitamos los espacios en blanco adicionales
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          sx={{ fontFamily: '"Kanit", sans-serif' }}
          component="th"
          scope="row"
        >
          {getNombrecliente(row.empleadoId)}
        </TableCell>
        {tiposHora.map((tipo) => (
          <TableCell
            sx={{ fontFamily: '"Kanit", sans-serif' }}
            key={tipo}
            align="right"
          >
            {row[tipo] ? row[tipo] : 0}
          </TableCell>
        ))}
        <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }} align="right">
          <strong>
            {totalEmpleadoObra.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </strong>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          sx={{ fontFamily: '"Kanit", sans-serif' }}
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={tiposHora.length + 2}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="detalles">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                      Fecha Carga
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                      Fecha Trabajo
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                      Horas
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                      Valor Hora
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                      Tipo Hora
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.details.map((detail, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                        {formatDate(detail.fechaCarga)}
                      </TableCell>
                      <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                        {formatDate(detail.fechaHora)}
                      </TableCell>
                      <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                        {detail.horas}
                      </TableCell>
                      <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                        {detail.valorHora.toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                      </TableCell>
                      <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                        {removeWordHora(detail.tipoHora)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function GastosHorasPage() {
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [tiposHora, setTiposHora] = useState([]);
  const { openDrawer } = React.useContext(DrawerContext);
  const { empleados, clientes } = React.useContext(TableContext);
  const [obra, setObra] = React.useState([]);

  useEffect(() => {
    const fetchHoras = async () => {
      const q = query(collection(db, "horas"), where("obraId", "==", id));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => doc.data());

      const allTiposHora = new Set();
      const groupedData = data.reduce((acc, curr) => {
        allTiposHora.add(curr.tipoHora);
        if (!acc[curr.empleadoId]) {
          acc[curr.empleadoId] = { empleadoId: curr.empleadoId, details: [] };
        }
        acc[curr.empleadoId][curr.tipoHora] =
          (acc[curr.empleadoId][curr.tipoHora] || 0) + curr.horas;
        acc[curr.empleadoId].details.push({
          fechaHora: curr.fechaHora,
          fechaCarga: curr.fechaCarga,
          horas: curr.horas,
          valorHora: curr.valorHora,
          tipoHora: curr.tipoHora,
        });
        return acc;
      }, {});

      setTiposHora(Array.from(allTiposHora));
      setRows(Object.values(groupedData));
    };

    fetchHoras();
  }, [id]);

  function capitalizeAndSpaceAfterHora(tipoHora) {
    // Convertir la primera letra a mayúscula
    let capitalized = tipoHora.charAt(0).toUpperCase() + tipoHora.slice(1);

    // Agregar un espacio después de la palabra "Hora"
    capitalized = capitalized.replace(/Hora/g, "Hora ");

    return capitalized;
  }

  React.useEffect(() => {
    const fetchObra = async () => {
      try {
        const obraDoc = await getDoc(doc(db, "obras", id));
        if (obraDoc.exists()) {
          setObra(obraDoc.data());
          console.log(obra);
          // Realiza cualquier otra operación que necesites con los datos de la obra
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching obra:", error);
      }
    };

    fetchObra();
  }, []);

  const getNombrecliente = (idcliente) => {
    const cliente = clientes.find((cat) => cat.id === idcliente);
    return cliente ? cliente.nombre : "Desconocida";
  };

  return (
    <div
      style={{
        fontFamily: '"Kanit", sans-serif',
        display: "flex",
        flexDirection: "column",
      }}
    >
      {obra && (
        <div style={{ marginLeft: openDrawer ? "16.5rem" : "6.5rem" }}>
          <h6>En la Obra ID: #{id || "No disponible"}</h6>
          <p>
            <strong>Lugar:</strong> {obra.lugar || "No disponible"}
          </p>
          <p>
            <strong>Distancia:</strong>{" "}
            {obra.distancia?.nombre || "No disponible"}
          </p>
          <p>
            <strong>Fecha Inicio:</strong>{" "}
            {obra.fechaInicio ? formatDate(obra.fechaInicio) : "No disponible"}
          </p>
        </div>
      )}
      <h5
        style={{
          marginLeft: openDrawer ? "16.5rem" : "6.5rem",
          fontWeight: "200",
          marginBottom: "1rem",
          marginTop: "1rem",
        }}
      >
        {getNombrecliente(obra.cliente)} > {obra.descripcion}
      </h5>
      <TableContainer
        component={Paper}
        style={{
          width: openDrawer ? "80%" : "90%",
          marginLeft: openDrawer ? "16.5rem" : "6.5rem",
          color: "white",
          fontFamily: '"Kanit", sans-serif',
        }}
      >
        <Table aria-label="collapsible table">
          <TableHead
            sx={{
              color: "white",
              fontFamily: '"Kanit", sans-serif',
              backgroundColor: "#121621",
            }}
          >
            <TableRow>
              <TableCell
                sx={{ fontFamily: '"Kanit", sans-serif' }}
                style={{ color: "white", fontFamily: '"Kanit", sans-serif' }}
              />
              <TableCell
                sx={{ fontFamily: '"Kanit", sans-serif' }}
                style={{ color: "white", fontFamily: '"Kanit", sans-serif' }}
              >
                Empleado
              </TableCell>
              {tiposHora.map((tipo) => (
                <TableCell
                  sx={{ fontFamily: '"Kanit", sans-serif' }}
                  style={{ color: "white", fontFamily: '"Kanit", sans-serif' }}
                  key={tipo}
                  align="right"
                >
                  {capitalizeAndSpaceAfterHora(tipo)}
                </TableCell>
              ))}
              <TableCell
                sx={{ fontFamily: '"Kanit", sans-serif' }}
                style={{ color: "white", fontFamily: '"Kanit", sans-serif' }}
                align="right"
              >
                Total Empleado/Obra
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row
                key={row.empleadoId}
                row={row}
                tiposHora={tiposHora}
                empleados={empleados}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
