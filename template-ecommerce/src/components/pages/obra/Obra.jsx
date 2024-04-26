import React from "react";
import ListEmpleado from "./listEmpleado/ListEmpleado";
import Dashboard from "./dashboard/Dashboard";

const Obra = ({ idObra, obras, idCliente }) => {
  return (
    <div style={{ width: "80%" }}>
      {/* Esta es la obra: ${idObra} */}
      <Dashboard idObra={idObra} obras={obras} idCliente={idCliente} />
    </div>
  );
};

export default Obra;
