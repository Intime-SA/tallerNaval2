import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import ProveedoresListDetail from "./ProveedoresListDetail";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import ProveedoresForm from "./ProveedoresForm";
import * as XLSX from "xlsx"; // Importa la biblioteca XLSX

const Proveedores = () => {
  const [customers, setCustomers] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [statusDelete, setStatusDelete] = useState(false);
  const [statusEdit, setStatusEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [customersPerPage] = useState(5); // Cantidad de clientes por página
  const [clients, setClients] = useState();
  const [filterValue, setFilterValue] = useState(""); // Estado para almacenar el valor del filtro

  useEffect(() => {
    let refCollection = collection(db, "proveedores");
    getDocs(refCollection)
      .then((querySnapshot) => {
        let newArray = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          newArray.push({ ...userData, id: doc.id });
        });
        setCustomers(newArray);
      })
      .catch((err) => console.log(err));
  }, [statusDelete, openForm, statusEdit]);

  useEffect(() => {
    if (customers) {
      setClients(customers.length);
    }
  }, [customers]);

  const exportToExcel = () => {
    const data = customers.map((customer) => {
      const filaPedido = [
        customer.roll,
        customer.telefono,
        customer.email,
        customer.name,
        customer.apellido,
      ];
      return filaPedido;
    });

    const header = [
      "Roll",
      "Telefono",
      "Correo Electronico",
      "Nombre",
      "Apellido",
    ];

    const wsData = [header, ...data];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MiHojaDeCalculo");
    XLSX.writeFile(wb, "Clientes.xlsx");
  };

  // Calcular índices del primer y último cliente en la página actual
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;

  // Filtrar los clientes por el valor del campo de filtro
  const filteredCustomers = customers.filter((customer) =>
    `${customer.nombreComercio.toLowerCase()}`.includes(
      filterValue.toLowerCase()
    )
  );

  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontSize: "2rem",
        position: "relative",
        width: "70vw",
        marginLeft: "13vw",
        marginRight: "13vw",
      }}
    >
      <Box>
        <div style={{ marginBottom: "1rem" }}>
          <Button
            style={{ marginLeft: "1rem" }}
            variant="outlined"
            color="error"
            onClick={exportToExcel}
          >
            <span
              style={{ marginRight: "0.5rem" }}
              className="material-symbols-outlined"
            >
              download
            </span>
            Exportar Lista
          </Button>
          <Button
            style={{ marginLeft: "1rem" }}
            variant="contained"
            color="error"
            onClick={() => setOpenForm(true)}
          >
            <span
              style={{ marginRight: "0.5rem" }}
              className="material-symbols-outlined"
            >
              person_add
            </span>
            Nuevo Proveedor
          </Button>
        </div>
        {/* Campo de filtro */}
      </Box>
      <h6>Cantidad total de proveedores: {clients}</h6>
      <TextField
        label=""
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        variant="outlined"
        style={{ marginLeft: "10px", padding: "5px", marginBottom: "0.5rem" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <div
                style={{
                  width: "10rem",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{ fontSize: "150%" }}
                  class="material-symbols-outlined"
                >
                  manage_search
                </span>
              </div>
            </InputAdornment>
          ),
        }}
      />
      <div style={{ width: "100%" }}>
        {!openForm ? (
          <ProveedoresListDetail
            customers={currentCustomers}
            setStatusDelete={setStatusDelete}
            statusDelete={statusDelete}
            setOpenForm={setOpenForm}
            setStatusEdit={setStatusEdit}
            statusEdit={statusEdit}
          />
        ) : (
          <ProveedoresForm
            customers={customers}
            setOpenForm={setOpenForm}
            openForm={openForm}
          />
        )}
      </div>
      <Box
        mt={2}
        style={{ display: "flex", justifyContent: "center", width: "100%" }}
      >
        {/* Botones de paginación */}
        <Button
          variant="contained"
          color="inherit"
          disabled={currentPage === 1}
          onClick={() => paginate(currentPage - 1)}
          style={{ margin: "1rem" }}
        >
          <span class="material-symbols-outlined">navigate_before</span>
        </Button>
        <Button
          variant="contained"
          onClick={() => paginate(currentPage + 1)}
          style={{ margin: "1rem" }}
        >
          <span class="material-symbols-outlined">navigate_next</span>
        </Button>
      </Box>
    </div>
  );
};

export default Proveedores;
