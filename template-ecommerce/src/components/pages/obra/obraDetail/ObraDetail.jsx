import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";

export default function ObraDetail({ idObra, cambioHoras }) {
  const [horasObra, setHorasObra] = React.useState(0);

  const TAX_RATE = 0.3;

  function ccyFormat(num) {
    return num.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    });
  }

  function priceRow(qty, unit) {
    return qty * unit;
  }

  function createRow(desc, qty, unit) {
    const price = priceRow(qty, unit);
    return { desc, qty, unit, price };
  }

  function subtotal(items) {
    return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
  }

  const rows = [createRow("Horas", horasObra, 25000)];

  const invoiceSubtotal = subtotal(rows);
  const invoiceTaxes = TAX_RATE * invoiceSubtotal;
  const invoiceTotal = invoiceTaxes + invoiceSubtotal;

  React.useEffect(() => {
    const consultaObra = async () => {
      try {
        const obraRef = doc(db, "obras", idObra); // Referencia a la obra específica
        const obraSnapshot = await getDoc(obraRef);

        if (obraSnapshot.exists()) {
          const horasEmpleado = obraSnapshot.data().horasEmpleado;

          // Sumar los valores numéricos de las horas del empleado de la obra específica
          const sumaHoras = Object.values(horasEmpleado).reduce(
            (acc, curr) => acc + curr,
            0
          );

          // Guardar la suma de horas en horasObra (como un número, no un array)
          setHorasObra(sumaHoras);
          console.log(sumaHoras);
        } else {
          console.error("No existe la obra con el ID especificado.");
        }
      } catch (error) {
        console.error("Error fetching Obra:", error);
      }
    };

    consultaObra();
  }, [idObra, cambioHoras]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell align="left" colSpan={3}>
              Conceptos de Gasto
            </TableCell>
            <TableCell align="right">Acumulados</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Categoria</TableCell>
            <TableCell align="right">Cantidad</TableCell>
            <TableCell align="right">Precio</TableCell>
            <TableCell align="right">Suma Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.desc}>
              <TableCell>{row.desc}</TableCell>
              <TableCell align="right">{row.qty}</TableCell>
              <TableCell align="right">{ccyFormat(row.unit)}</TableCell>
              <TableCell align="right">{ccyFormat(row.price)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell rowSpan={3} />
            <TableCell colSpan={2}>Subtotal</TableCell>
            <TableCell align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Agregado %</TableCell>
            <TableCell align="right">{`${(TAX_RATE * 100).toFixed(
              0
            )} %`}</TableCell>
            <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} style={{ fontWeight: "900" }}>
              Total
            </TableCell>
            <TableCell align="right" style={{ fontWeight: "900" }}>
              {ccyFormat(invoiceTotal)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
