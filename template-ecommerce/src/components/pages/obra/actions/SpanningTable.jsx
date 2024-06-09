import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function SpanningTable({ impuesto }) {
  console.log(impuesto);
  // Verificación para asegurar que impuestos es un array
  const impuestosArray = Array.isArray(impuesto) ? impuesto : [];
  console.log(impuestosArray);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 300 }} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell>Tipo de Impuesto</TableCell>
            <TableCell align="right">Monto</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {impuestosArray.map((impuesto, index) => (
            <TableRow key={index}>
              <TableCell>{impuesto.tipoImpuesto}</TableCell>
              <TableCell align="right">{impuesto.monto.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
