import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import ListEmpleado from "../listEmpleado/ListEmpleado";
import ObraDetail from "../obraDetail/ObraDetail";
import useMediaQuery from "@mui/material/useMediaQuery";
import ObrasGastos from "../obraGastos/ObraGastos";
import Actions from "../actions/Actions";
import Chart from "../charts/Chart";
import ModalComponent from "../actions/ModalComponent";
import CircularProgre from "./CircularProgre";
import ModalComponentGasto from "../actions/ModalComponentGasto";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import "./Dashboard.css";
import { Button } from "@mui/material";
import * as XLSX from "xlsx"; // Importa la biblioteca XLSX

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Dashboard({ idObra, obras, idCliente }) {
  const [cambioHoras, setCambioHoras] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [arrayEmpleados, setArrayEmpleados] = React.useState([]);
  const [actualizarEmpleados, setActualizarEmpleados] = React.useState(false);
  const [openProgress, setOpenProgress] = React.useState(false);
  const [openModalGasto, setOpenModalGasto] = React.useState(false);
  const [cambioGastos, setCambioGastos] = React.useState(false);
  const [totalGastos, setTotalGastos] = React.useState(0);
  const [totalHorasEmpleado, setTotalHorasEmpleado] = React.useState(0);
  const [totalObra, setTotalObra] = React.useState(0);
  const [arrayHoras, setArrayHoras] = React.useState([]);
  const [arrayGastos, setArrayGastos] = React.useState([]);

  const isMobile = useMediaQuery("(max-width:760px)");

  React.useEffect(() => {
    window.scrollTo(0, 0); // Hace scroll hacia arriba al renderizar el componente
  }, []);

  React.useEffect(() => {
    const fetchObras = async () => {
      try {
        const gastosCollection = collection(db, "gastos");
        const gastoSnap = await getDocs(gastosCollection);
        let total = 0;

        gastoSnap.forEach((gasto) => {
          const gastoData = gasto.data();
          if (gastoData.obraId === idObra) {
            total += gastoData.importe; // Suponiendo que "importe" es la propiedad que contiene el importe del gasto
          }
        });

        // Actualizar el estado totalObra con el total calculado
        setTotalGastos(total);
        setTotalObra(total); // Usando el valor actualizado de total
      } catch (error) {
        console.error("Error fetching obras:", error);
      }
    };

    fetchObras();
  }, [idObra, cambioGastos]);

  React.useEffect(() => {
    const consultaHoras = async () => {
      try {
        const collectionHoras = collection(db, "horas");
        const horasSnapshot = await getDocs(collectionHoras);
        const horasData = [];

        for (const doc of horasSnapshot.docs) {
          horasData.push({
            id: doc.id,
            ...doc.data(),
          });
        }

        // Filtrar horasData por obraId igual a idObra
        const horasFiltradas = horasData.filter(
          (hora) => hora.obraId === idObra
        );

        setArrayHoras(horasFiltradas);
      } catch (error) {
        console.error("error: ", error);
      }
    };

    consultaHoras();
  }, [cambioHoras]);

  React.useEffect(() => {
    const consultaGastos = async () => {
      try {
        const collectionGastos = collection(db, "gastos");
        const GastosSnapshot = await getDocs(collectionGastos);
        const GastosData = [];

        for (const doc of GastosSnapshot.docs) {
          GastosData.push({
            id: doc.id,
            ...doc.data(),
          });
        }

        // Filtrar GastosData por obraId igual a idObra
        const GastosFiltradas = GastosData.filter(
          (gasto) => gasto.obraId === idObra
        );

        setArrayGastos(GastosFiltradas);
      } catch (error) {
        console.error("error: ", error);
      }
    };

    consultaGastos();
  }, [cambioGastos]);

  React.useEffect(() => {
    setTotalObra(totalGastos);
    let nuevoTotal = totalHorasEmpleado * 25000;
    console.log(totalHorasEmpleado);
    console.log(nuevoTotal);
    setTotalObra(totalGastos + nuevoTotal);
    setCambioHoras(false);
  }, [totalGastos, totalHorasEmpleado, cambioHoras]);

  const exportToExcelGasto = () => {
    // Construir los datos para cada gasto registrado
    const data = arrayGastos.map((gasto) => {
      return [
        gasto.obraId || "",
        gasto.clienteId || "",
        gasto.proveedorId || "",
        gasto.categoria || "",
        gasto.importe || "",
        gasto.descripcion || "",
        gasto.gastoGlobal ? "Sí" : "No",
        gasto.gastoObra ? "Sí" : "No",
        gasto.fechaGasto
          ? new Date(gasto.fechaGasto.seconds * 1000).toLocaleString()
          : "",
        gasto.fechaCarga
          ? new Date(gasto.fechaCarga.seconds * 1000).toLocaleString()
          : "",
      ];
    });

    // Encabezados de las columnas para los gastos registrados
    const header = [
      "ID Obra",
      "ID Cliente",
      "ID Proveedor",
      "Categoría",
      "Importe",
      "Descripción",
      "¿Gasto Global?",
      "¿Gasto de Obra?",
      "Fecha de Gasto",
      "Fecha de Carga",
    ];

    // Combinar encabezados y datos para los gastos registrados
    const wsData = [header, ...data];

    // Crear hoja de cálculo para los gastos registrados
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Crear un nuevo libro de Excel
    const wb = XLSX.utils.book_new();

    // Agregar hoja de cálculo al libro
    XLSX.utils.book_append_sheet(wb, ws, "GastosRegistrados");

    // Descargar el archivo Excel
    XLSX.writeFile(wb, "GastosRegistrados.xlsx");
  };

  const exportToExcel = () => {
    // Construir los datos para cada hora registrada
    const data = arrayHoras.map((hora) => {
      return [
        hora.obraId || "",
        hora.empleadoId || "",
        hora.clienteId || "",
        hora.horas || "",
        hora.fechaCarga
          ? new Date(hora.fechaCarga.seconds * 1000).toLocaleString()
          : "",
      ];
    });

    // Encabezados de las columnas para las horas registradas
    const header = [
      "ID Obra",
      "ID Empleado",
      "ID Cliente",
      "Horas",
      "Fecha de Carga",
    ];

    // Combinar encabezados y datos para las horas registradas
    const wsData = [header, ...data];

    // Crear hoja de cálculo para las horas registradas
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Crear un nuevo libro de Excel
    const wb = XLSX.utils.book_new();

    // Agregar hoja de cálculo al libro
    XLSX.utils.book_append_sheet(wb, ws, "HorasTrabajadas");

    // Descargar el archivo Excel
    XLSX.writeFile(wb, "HorasTrabajadas.xlsx");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {openModal && (
        <ModalComponent
          openModal={openModal}
          setOpenModal={setOpenModal}
          arrayEmpleados={arrayEmpleados}
          idObra={idObra}
          setActualizarEmpleados={setActualizarEmpleados}
        />
      )}
      {openModalGasto && (
        <ModalComponentGasto
          openModalGasto={openModalGasto}
          setOpenModalGasto={setOpenModalGasto}
          idObra={idObra}
          idCliente={idCliente}
          setCambioGastos={setCambioGastos}
        />
      )}
      <Grid
        container
        spacing={2}
        justifyContent="center"
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          width: isMobile ? "95vw" : "100vw",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <Grid
          item
          xs={12}
          sx={{
            margin: "0px",
            padding: "0px",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Actions
            setOpenModal={setOpenModal}
            idObra={idObra}
            setOpenModalGasto={setOpenModalGasto}
          />
        </Grid>
        <Grid xs={isMobile ? 12 : 4}>
          <div
            style={{
              display: "flex",
              justifyContent: isMobile ? "space-between" : "space-around",
              width: isMobile ? "90vw" : "85vw",
              alignItems: "flex-end",
              fontSize: "150%",
              margin: "1rem",
              backgroundColor: "#f7f7f7", // Color de fondo
              padding: "1rem",
              borderRadius: "8px", // Bordes redondeados
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Sombra
            }}
          >
            <p className="bebas-neue-regular" style={{ color: "green" }}>
              TOTAL ACTUAL:{" "}
            </p>
            <p
              className="bebas-neue-regular"
              style={{ color: "green", fontWeight: "bold" }}
            >
              {totalObra.toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })}
            </p>
          </div>
        </Grid>

        <Grid
          item
          xs={isMobile ? 12 : 10} // Cambiado a 12 en móvil, 10 en escritorio
          sx={{
            margin: "0px",
            padding: "0px",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <ListEmpleado
            idObra={idObra}
            setCambioHoras={setCambioHoras}
            idCliente={idCliente}
            setArrayEmpleados={setArrayEmpleados}
            arrayEmpleados={arrayEmpleados}
            actualizarEmpleados={actualizarEmpleados}
            setOpenProgress={setOpenProgress}
            openProgress={openProgress}
            setTotalHorasEmpleado={setTotalHorasEmpleado}
            setActualizarEmpleados={setActualizarEmpleados}
          />
        </Grid>
        <Grid
          xs={isMobile ? 12 : 3.5}
          /* sx={{ marginLeft: isMobile ? 0 : "1rem" }} */
        >
          <div>
            <Button
              onClick={() => {
                exportToExcel();
              }}
              variant="outlined"
              /* style={{ marginLeft: "1rem" }} */
            >
              Detalle Horas{" "}
              <span
                /* style={{ marginLeft: "1rem" }} */
                class="material-symbols-outlined"
              >
                print
              </span>
            </Button>
          </div>
          <ObraDetail
            idObra={idObra}
            cambioHoras={cambioHoras}
            setTotalHorasEmpleado={setTotalHorasEmpleado}
          />
        </Grid>
        <Grid sx={{ textAlign: "right" }} xs={isMobile ? 12 : 4}>
          <div>
            <Button
              onClick={() => {
                exportToExcelGasto();
              }}
              variant="outlined"
              style={{ marginRight: "1rem" }}
            >
              Detalle Gastos{" "}
              <span
                style={{ marginRight: "1rem" }}
                class="material-symbols-outlined"
              >
                print
              </span>
            </Button>
          </div>
          <ObrasGastos idObra={idObra} cambioGastos={cambioGastos} />
          <div
            style={{
              display: "flex",
              justifyContent: isMobile ? "space-between" : "space-around",
              width: isMobile ? "90vw" : "40vw",
              alignItems: "flex-end",
              /*               marginLeft: isMobile ? "1rem" : "0rem", */
              fontSize: "150%",
              margin: "1rem",
              marginLeft: "0rem",
            }}
          >
            <p className="bebas-neue-regular">TOTAL GASTOS: </p>
            <p className="bebas-neue-regular">
              {totalGastos.toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })}
            </p>
          </div>
        </Grid>

        <Grid
          xs={isMobile ? 10 : 2}
          sx={{ display: "flex", justifyContent: "center" }} // Cambiado a 12 en móvil, 12 en escritorio
        >
          <Chart
            idObra={idObra}
            cambioGastos={cambioGastos}
            setCambioGastos={setCambioGastos}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
