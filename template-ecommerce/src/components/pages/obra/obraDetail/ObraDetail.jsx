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
import useMediaQuery from "@mui/material/useMediaQuery";

export default function ObraDetail({
  idObra,
  cambioHoras,
  setTotalHorasEmpleado,
}) {
  const [horasObra, setHorasObra] = React.useState(0);

  const isMobile = useMediaQuery("(max-width:760px)");

  const TAX_RATE = 0;

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
          setTotalHorasEmpleado(sumaHoras);
          setHorasObra(sumaHoras);
        } else {
          console.error("No existe la obra con el ID especificado.");
        }
      } catch (error) {
        console.error("Error fetching Obra:", error);
      }
      console.log(horasObra);
    };

    consultaObra();
  }, [idObra, cambioHoras]);

  return (
    <TableContainer
      sx={{
        width: isMobile ? "90vw" : 500,
        marginTop: "1rem",
        marginBottom: "1rem",
      }}
      component={Paper}
    >
      <Table
        sx={{
          width: isMobile ? "100% " : 500,
        }}
        aria-label="spanning table"
      >
        <TableHead sx={{ backgroundColor: "rgba(194, 202, 208, 0.72)" }}>
          <TableRow>
            <TableCell align="left">Horas</TableCell>
            {isMobile ? (
              <TableCell></TableCell>
            ) : (
              <TableCell align="left">Precio</TableCell>
            )}
            <TableCell align="right">Suma Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.desc}>
              <TableCell align="left">{row.qty}</TableCell>
              {isMobile ? (
                <TableCell></TableCell>
              ) : (
                <TableCell align="left">{ccyFormat(row.unit)}</TableCell>
              )}

              <TableCell align="right">{ccyFormat(row.price)}</TableCell>
            </TableRow>
          ))}
          {/* <TableRow>
            <TableCell>{`${(TAX_RATE * 100).toFixed()} %`}</TableCell>
            <TableCell align="right"> </TableCell>
            <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
          </TableRow> */}
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
