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
    console.log(clienteId); // Esto imprimirá el ID del cliente, no el ID de la obra
  };

  return (
    <>
      {clientes.map((cliente) => (
        <Card
          key={cliente.id}
          sx={{ maxWidth: 280, marginBottom: 20, margin: 2 }}
        >
          <CardActionArea>
            <CardMedia
              component="img"
              height="120"
              image={cliente.imagen}
              alt="Cliente Image"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {cliente.nombre}
              </Typography>
              {obras
                .filter((obra) => obra.cliente === cliente.id)
                .map(
                  (
                    obra // Cambié el parámetro de index a obra
                  ) => (
                    <Typography
                      key={obra.id} // Usamos el ID de la obra como clave
                      variant="body2"
                      color="text.secondary"
                      fontSize="80%"
                    >
                      {obra.descripcion}
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
                      <button onClick={() => openObra(obra.id, cliente.id)}>
                        Abrir Obra
                      </button>{" "}
                      {/* Agregamos un botón para abrir la obra */}
                    </Typography>
                  )
                )}
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </>
  );
}
