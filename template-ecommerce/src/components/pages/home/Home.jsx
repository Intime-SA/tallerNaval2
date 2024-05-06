import Cards from "../cards/Cards";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useEffect, useState } from "react";
import Obra from "../obra/Obra";
import CardNew from "../cards/CardNew";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Home() {
  const [arrayClientes, setArrayClientes] = useState([]);
  const [arrayObras, setArrayObras] = useState([]);
  const [openObra, setOpenObra] = useState(false);
  const [idObra, setIdObra] = useState("");
  const [idCliente, setIdCliente] = useState("");

  useEffect(() => {
    const consultaClientes = async () => {
      try {
        const collectionClientes = collection(db, "clientes");
        const clientesSnapshots = await getDocs(collectionClientes);
        const clientesData = clientesSnapshots.docs.map((client) => ({
          id: client.id,
          ...client.data(),
        }));
        setArrayClientes(clientesData);
        console.log(clientesSnapshots);
        console.log(db);
        console.log(arrayClientes);
      } catch (error) {
        console.error("Error fetching clientes:", error);
      }
    };

    consultaClientes();
  }, []);

  useEffect(() => {
    const consultaObras = async () => {
      try {
        const collectionObras = collection(db, "obras");
        const obrasSnapshot = await getDocs(collectionObras);
        const obrasData = obrasSnapshot.docs.map((obra) => ({
          id: obra.id,
          ...obra.data(),
        }));
        setArrayObras(obrasData);
      } catch (error) {
        console.error("Error fetching obras:", error);
      }
    };

    consultaObras();
  }, []);

  const isMobile = useMediaQuery("(max-width:760px)");

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isMobile ? "center" : "flex-start",
        flexDirection: "row",
        width: "95vw",
        marginLeft: isMobile ? "0px" : "5rem",
      }}
    >
      {!openObra && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <CardNew />
          <Cards
            clientes={arrayClientes}
            obras={arrayObras}
            setOpenObra={setOpenObra}
            setIdObra={setIdObra}
            setIdCliente={setIdCliente}
          />
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {openObra && (
          <Obra idObra={idObra} obras={arrayObras} idCliente={idCliente} />
        )}
      </div>
    </div>
  );
}
