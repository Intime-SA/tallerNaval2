import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";

export default function Chart({ idObra, cambioGastos, setCambioGastos }) {
  const [gastos, setGastos] = React.useState([]);
  const [chartData, setChartData] = React.useState([]);

  React.useEffect(() => {
    const consultaObra = async () => {
      try {
        const obraRef = collection(db, "gastos");
        const obraSnapshot = await getDocs(obraRef);
        let arrayGastosObra = [];
        obraSnapshot.forEach((element) => {
          if (element.data().obraId === idObra)
            arrayGastosObra.push(element.data());
        });

        setGastos(arrayGastosObra);

        // Calcular totales por categoría
        const categoriasTotales = {};
        arrayGastosObra.forEach((gasto) => {
          if (gasto.categoria in categoriasTotales) {
            categoriasTotales[gasto.categoria] += gasto.importe;
          } else {
            categoriasTotales[gasto.categoria] = gasto.importe;
          }
        });

        // Convertir los totales en el formato requerido para el gráfico de torta
        const chartData = Object.keys(categoriasTotales).map(
          (categoria, index) => ({
            id: index,
            value: categoriasTotales[categoria],
            label: categoria,
          })
        );

        setChartData(chartData);
      } catch (error) {
        console.error("Error fetching Obra:", error);
      }
    };

    consultaObra();
    setCambioGastos(false);
  }, [idObra, cambioGastos]);

  return <PieChart series={[{ data: chartData }]} width={400} height={200} />;
}
