import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";

export default function Chart({ idObra }) {
  const [gastos, setGastos] = React.useState([]);

  React.useEffect(() => {
    const consultaObra = async () => {
      try {
        const obraRef = doc(db, "obras", idObra); // Referencia a la obra específica
        const obraSnapshot = await getDoc(obraRef);

        if (obraSnapshot.exists()) {
          const gastosData = obraSnapshot.data().gastos;

          // Transformar los datos de gastos a la estructura adecuada para el gráfico
          const formattedGastos = Object.entries(gastosData).map(
            ([label, value], index) => ({
              id: index,
              value: value,
              label: label,
            })
          );

          setGastos(formattedGastos);
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
    <PieChart
      series={[
        {
          data: gastos,
        },
      ]}
      width={400}
      height={200}
    />
  );
}
