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

  const isMobile = useMediaQuery("(max-width:760px)");

  React.useEffect(() => {
    window.scrollTo(0, 0); // Hace scroll hacia arriba al renderizar el componente
  }, []);

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
      <Grid
        container
        spacing={2}
        justifyContent="center"
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          width: "95vw",
          justifyContent: "center",
        }}
      >
        <Grid
          item
          xs={4}
          sx={{
            margin: "0px",
            padding: "0px",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Actions setOpenModal={setOpenModal} idObra={idObra} />
        </Grid>
        <Grid
          item
          xs={4}
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
          />
        </Grid>
        <Grid xs={isMobile ? 10 : 8}>
          <ObraDetail idObra={idObra} cambioHoras={cambioHoras} />
        </Grid>
        <Grid xs={isMobile ? 10 : 7.5}>
          <ObrasGastos idObra={idObra} />
        </Grid>
        <Grid
          xs={isMobile ? 10 : 7.5}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Chart idObra={idObra} />
        </Grid>
      </Grid>
    </Box>
  );
}
