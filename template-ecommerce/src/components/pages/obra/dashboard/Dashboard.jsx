import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import ListEmpleado from "../listEmpleado/ListEmpleado";
import ObraDetail from "../obraDetail/ObraDetail";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Dashboard({ idObra, obras, idCliente }) {
  const [cambioHoras, setCambioHoras] = React.useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <ListEmpleado
            idObra={idObra}
            setCambioHoras={setCambioHoras}
            idCliente={idCliente}
          />
        </Grid>
        <Grid item xs={8}>
          <ObraDetail idObra={idObra} cambioHoras={cambioHoras} />
        </Grid>
        {/*         <Grid item xs={8}>
          <Item>xs=4</Item>
        </Grid>
        <Grid item xs={4}>
          <Item>xs=8</Item>
        </Grid> */}
      </Grid>
    </Box>
  );
}
