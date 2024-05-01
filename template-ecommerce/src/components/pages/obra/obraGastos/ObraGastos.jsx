import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import useMediaQuery from "@mui/material/useMediaQuery";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";

function createData(name, calories, fat, carbs, protein, price) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      {
        date: "2020-01-05",
        customerId: "11091700",
        amount: 3,
      },
      {
        date: "2020-01-02",
        customerId: "Anonymous",
        amount: 1,
      },
    ],
  };
}

function ccyFormat(num) {
  return num.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
}

function Row(props) {
  const isMobile = useMediaQuery("(max-width:760px)");

  const { row, nombrePropiedad, valorPropiedad, index } = props;
  const [open, setOpen] = React.useState(false);

  const propertyColors = {
    comida: "rgba(184, 0, 216, 1)",
    gastosCapital: "rgba(96, 0, 155, 1)",
    impuestos: "rgba(46, 150, 255, 1)",
    mercaderia: "rgba(2, 178, 175, 1)",
    viaticos: "rgba(39, 49, 200, 1)",
  };

  // Función para obtener el color de fondo de la fila según el nombre de la propiedad
  const getRowBackgroundColor = (nombrePropiedad) => {
    return propertyColors[nombrePropiedad] || "rgba(0, 0, 0, 0)"; // Si no hay color definido, devuelve un color transparente
  };

  return (
    <React.Fragment>
      <TableRow
        sx={{
          backgroundColor: getRowBackgroundColor(nombrePropiedad),
          "& > *": { borderBottom: "unset" },
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" color="white">
          {nombrePropiedad}
        </TableCell>
        <TableCell align="right">{ccyFormat(valorPropiedad)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead
                  sx={{ backgroundColor: "rgba(194, 202, 208, 0.72)" }}
                >
                  <TableRow>
                    <TableCell style={{ fontSize: "90%" }}>Fecha</TableCell>
                    <TableCell style={{ fontSize: "90%" }}>Proveedor</TableCell>
                    <TableCell align="right" style={{ fontSize: "90%" }}>
                      Cantidad
                    </TableCell>
                    <TableCell align="right" style={{ fontSize: "90%" }}>
                      Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                {/* <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ fontSize: "70%" }}
                      >
                        {historyRow.date}
                      </TableCell>
                      <TableCell style={{ fontSize: "70%" }}>
                        {historyRow.customerId}
                      </TableCell>
                      <TableCell align="right" style={{ fontSize: "70%" }}>
                        {historyRow.amount}
                      </TableCell>
                      <TableCell align="right" style={{ fontSize: "70%" }}>
                        {ccyFormat(
                          Math.round(historyRow.amount * row.price * 100) / 100
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody> */}
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};

export default function ObrasGastos({ idObra }) {
  const [gastos, setGastos] = React.useState();
  const isMobile = useMediaQuery("(max-width:760px)");
  React.useEffect(() => {
    const consultaObra = async () => {
      try {
        const obraRef = doc(db, "obras", idObra); // Referencia a la obra específica
        const obraSnapshot = await getDoc(obraRef);

        if (obraSnapshot.exists()) {
          const gastos = obraSnapshot.data().gastos;

          // Sumar los valores numéricos de las horas del empleado de la obra específica

          setGastos(gastos);
          console.log(gastos);
        } else {
          console.error("No existe la obra con el ID especificado.");
        }
      } catch (error) {
        console.error("Error fetching Obra:", error);
      }
    };

    consultaObra();
  }, [idObra]);

  return (
    <TableContainer
      component={Paper}
      sx={{ width: isMobile ? "90vw" : 500, margin: "1rem" }}
    >
      <Table aria-label="collapsible table">
        <TableHead sx={{ backgroundColor: "rgba(194, 202, 208, 0.72)" }}>
          <TableRow>
            <TableCell />
            <TableCell>Categoria</TableCell>
            <TableCell align="right">TOTAL</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {gastos &&
            Object.entries(gastos).map(([nombre, valor], index) => (
              <Row
                key={nombre}
                nombrePropiedad={nombre}
                valorPropiedad={valor}
                index={index}
              />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
