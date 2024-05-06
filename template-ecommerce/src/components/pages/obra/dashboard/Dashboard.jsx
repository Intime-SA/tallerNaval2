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
    setTotalObra(totalGastos);
    let nuevoTotal = totalHorasEmpleado * 25000;
    console.log(totalHorasEmpleado);
    console.log(nuevoTotal);
    setTotalObra(totalGastos + nuevoTotal);
    setCambioHoras(false);
  }, [totalGastos, totalHorasEmpleado, cambioHoras]);

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
              justifyContent: isMobile ? "space-between" : "center",
              width: isMobile ? "90vw" : "100vw",
              alignItems: "flex-end",
              marginLeft: "1rem",
              fontSize: "150%",
              margin: "1rem",
            }}
          >
            <p className="bebas-neue-regular">TOTAL ACTUAL: </p>
            <p className="bebas-neue-regular">
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
          />
        </Grid>
        <Grid
          xs={isMobile ? 12 : 3.5}
          sx={{ marginLeft: isMobile ? 0 : "1rem" }}
        >
          <ObraDetail
            idObra={idObra}
            cambioHoras={cambioHoras}
            setTotalHorasEmpleado={setTotalHorasEmpleado}
          />
        </Grid>
        <Grid sx={{ textAlign: "right" }} xs={isMobile ? 12 : 4}>
          <ObrasGastos idObra={idObra} cambioGastos={cambioGastos} />
          <div
            style={{
              display: "flex",
              justifyContent: isMobile ? "space-between" : "center",
              width: isMobile ? "90vw" : "100vw",
              alignItems: "flex-end",
              marginLeft: "1rem",
              fontSize: "150%",
              margin: "1rem",
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
