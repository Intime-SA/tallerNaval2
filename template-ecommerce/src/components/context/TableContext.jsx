import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

// Crea un contexto para las tablas (proveedores, clientes y obras)
export const TableContext = createContext();

// Hook personalizado para acceder al contexto de las tablas
export const useTablas = () => {
  return useContext(TableContext);
};

// Proveedor de contexto que contiene el estado de las tablas y funciones relacionadas
export const TableContextComponent = ({ children }) => {
  const [proveedores, setProveedores] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [obras, setObras] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [egresos, setEgresos] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [ingresos, setIngresos] = useState([]);

  const fetchData = async (collectionName, setData) => {
    try {
      const ref = collection(db, collectionName);
      const snapshot = await getDocs(ref);
      const dataArray = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setData(dataArray);
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
    }
  };

  useEffect(() => {
    const obtenerDatos = async () => {
      await fetchData("proveedores", setProveedores);
      await fetchData("clientes", setClientes);
      await fetchData("obras", setObras);
      await fetchData("gastos", setGastos);
      await fetchData("categorias", setCategorias);
      await fetchData("ventas", setVentas);
      await fetchData("empleados", setEmpleados);
      await fetchData("egresos", setEgresos);
      await fetchData("cuentas", setCuentas);
      await fetchData("ingresos", setIngresos);
    };

    obtenerDatos();
  }, []);

  // Objeto de datos para el contexto
  const data = {
    proveedores,
    clientes,
    obras,
    gastos,
    categorias,
    ventas,
    empleados,
    egresos,
    cuentas,
    ingresos,
  };

  return <TableContext.Provider value={data}>{children}</TableContext.Provider>;
};
