import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea } from "@mui/material";

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
    console.log(clienteId); // Esto imprimirá el ID del cliente, no el ID de la obra
  };

  return (
    <>
      {clientes.map((cliente) => (
        <Card
          key={cliente.id}
          sx={{
            maxWidth: 350,
            marginBottom: 20,
            margin: 2,
            border: "1px solid #e0e0e0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            borderRadius: 8,
          }}
        >
          <CardActionArea>
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
              {obras
                .filter((obra) => obra.cliente === cliente.id)
                .map((obra) => (
                  <div key={obra.id}>
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
                    >
                      <button
                        onClick={() => openObra(obra.id, cliente.id)}
                        style={{
                          marginTop: 10,
                          padding: "8px 16px",
                          backgroundColor: "#007bff",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                        }}
                      >
                        Abrir Obra
                      </button>{" "}
                      <Button
                        onClick={() => openObra(obra.id, cliente.id)}
                        variant="contained"
                        color="error"
                        style={{
                          marginTop: 10,
                          padding: "8px 16px",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                        }}
                      >
                        Finalizar
                      </Button>{" "}
                    </div>
                  </div>
                ))}
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </>
  );
}
