import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

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

  return (
    <>
      {clientes.map((cliente) => (
        <Card
          key={cliente.id}
          sx={{
            maxWidth: 300,
            marginBottom: 20,
            marginBottom: 2,
            border: "1px solid #e0e0e0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            borderRadius: 8, // Ajusta el valor según tus preferencias
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Agrega una sombra
            backgroundColor: "#f5f5f5", // Color de fondo sutil
          }}
        >
          {obras &&
            obras
              .filter((obra) => obra.cliente === cliente.id)
              .map((obra) => (
                <CardActionArea
                  key={obra.id}
                  onClick={() => openObra(obra.id, cliente.id)}
                >
                  <CardMedia
                    component="img"
                    height="120"
                    image={cliente.imagen}
                    alt="Cliente Image"
                  />
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
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around   ",
                      }}
                    ></div>
                  </CardContent>
                </CardActionArea>
              ))}
        </Card>
      ))}
    </>
  );
}
