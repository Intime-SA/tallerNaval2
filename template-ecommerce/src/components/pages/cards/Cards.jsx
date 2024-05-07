import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Alert, CardActionArea } from "@mui/material";

export default function Cards({
  clientes,
  obras,
  setOpenObra,
  setIdObra,
  setIdCliente,
}) {
  const openObra = (idObra, clienteId) => {
    setOpenObra(true);
    setIdObra(idObra);
    setIdCliente(clienteId);
    console.log(idObra);
    console.log(clienteId);
  };

  const renderEstado = (estado) => {
    console.log(estado);
    if (estado === "enProceso") {
      return (
        <Alert variant="filled" severity="info">
          En proceso
        </Alert>
      );
    } else if (estado === "finalizado") {
      return (
        <Alert variant="filled" severity="success">
          Finalizado
        </Alert>
      );
    }
  };

  return (
    <>
      {clientes.map((cliente) => {
        const obrasCliente = obras.filter(
          (obra) => obra.cliente === cliente.id
        );
        return (
          <React.Fragment key={cliente.id}>
            {obrasCliente.map((obra) => (
              <Card
                key={obra.id}
                sx={{
                  minWidth: 320,
                  maxWidth: 320,
                  marginBottom: 20,
                  marginBottom: 2,
                  border: "1px solid #e0e0e0",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  borderRadius: 8,
                  backgroundColor: "#f5f5f5",
                }}
              >
                <CardActionArea onClick={() => openObra(obra.id, cliente.id)}>
                  <CardMedia
                    component="img"
                    height="120"
                    image={cliente.imagen}
                    alt="Cliente Image"
                  />
                  <div>{renderEstado(obra.estado)}</div>
                  <CardContent style={{ minHeight: 150 }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {cliente.nombre}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontSize="80%"
                    >
                      {obra.descripcion}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {obra.lugar}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Presupuesto Estimado: <br />
                      <br />
                      <strong>
                        {obra.presupuestoInicial.toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                          minimumFractionDigits: 2,
                        })}
                      </strong>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </React.Fragment>
        );
      })}
    </>
  );
}
