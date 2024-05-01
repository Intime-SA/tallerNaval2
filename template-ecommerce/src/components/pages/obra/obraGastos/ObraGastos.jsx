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

  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{ccyFormat(row.calories)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
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
                <TableBody>
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
                </TableBody>
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

const rows = [
  createData("Gastos Capital", 37500, 6.0, 24, 4.0, 3.99),
  createData("Comida", 25300, 9.0, 37, 4.3, 4.99),
  createData("Viaticos", 26200, 16.0, 24, 6.0, 3.79),
  createData("Mercaderia", 30575, 3.7, 67, 4.3, 2.5),
  createData("Engrasantes", 35886, 16.0, 49, 3.9, 1.5),
];

export default function ObrasGastos() {
  const isMobile = useMediaQuery("(max-width:760px)");

  return (
    <TableContainer
      component={Paper}
      sx={{ width: isMobile ? "90vw" : 500, margin: "1rem" }}
    >
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Categoria</TableCell>
            <TableCell align="right">TOTAL</TableCell>

            {/* <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
