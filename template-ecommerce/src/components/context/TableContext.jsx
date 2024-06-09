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

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // Obtener proveedores
        const refProveedores = collection(db, "proveedores");
        const proveedoresSnapshot = await getDocs(refProveedores);
        const proveedoresArray = proveedoresSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setProveedores(proveedoresArray);

        // Obtener clientes
        const refClientes = collection(db, "clientes");
        const clientesSnapshot = await getDocs(refClientes);
        const clientesArray = clientesSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setClientes(clientesArray);

        // Obtener obras
        const refObras = collection(db, "obras");
        const obrasSnapshot = await getDocs(refObras);
        const obrasArray = obrasSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setObras(obrasArray);

        // Obtener gastos
        const refGastos = collection(db, "gastos");
        const gastosSnapshot = await getDocs(refGastos);
        const gastosArray = gastosSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setGastos(gastosArray);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    obtenerDatos();
  }, []);

  // Objeto de datos para el contexto
  const data = {
    proveedores,
    clientes,
    obras,
    gastos,
  };

  return <TableContext.Provider value={data}>{children}</TableContext.Provider>;
};
