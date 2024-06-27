import React, { useContext } from "react";
import { TableContext } from "../../context/TableContext";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const Empleados = () => {
  const { empleados } = useContext(TableContext); // Asegúrate de que TableContext proporciona empleados
  const navigate = useNavigate();

  return (
    <div style={{ marginLeft: "16.5rem", marginTop: "2rem", width: "80%" }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          fontFamily: '"Kanit", sans-serif',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/agregarEmpleado")}
          style={{ margin: "1rem", fontFamily: '"Kanit", sans-serif' }}
        >
          Agregar Empleado
        </Button>
      </div>
      {empleados.map((empleado, index) => (
        <Card key={index} elevation={3} sx={{ marginBottom: "1.5rem" }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              style={{ fontFamily: '"Kanit", sans-serif' }}
            >
              {empleado.nombre} {empleado.apellido}
            </Typography>

            <Typography
              variant="body1"
              gutterBottom
              style={{ fontFamily: '"Kanit", sans-serif' }}
            >
              Teléfono: {empleado.telefono}
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              style={{ fontFamily: '"Kanit", sans-serif' }}
            >
              Fecha de Alta:{" "}
              {new Date(empleado.fechaAlta.seconds * 1000).toLocaleString(
                "es-AR"
              )}
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              style={{ fontFamily: '"Kanit", sans-serif' }}
            >
              Obras Activas: {empleado.obrasActivas.join(", ")}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Empleados;
