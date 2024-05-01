import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Actions() {
  const isMobile = useMediaQuery("(max-width:760px)");

  return (
    <Stack
      spacing={2}
      direction="row"
      justifyContent="center"
      sx={{
        width: isMobile ? "90vw" : 500,
        marginRight: "1rem",
        height: "2rem",
      }}
    >
      <Button style={{ fontSize: "60%" }} variant="text">
        <span style={{ margin: "0.5rem" }} class="material-symbols-outlined">
          person_add
        </span>
        Empleado
      </Button>
      <Button style={{ fontSize: "60%" }} variant="text">
        <span style={{ margin: "0.5rem" }} class="material-symbols-outlined">
          add_circle
        </span>
        Gasto
      </Button>
      <Button
        style={{
          fontSize: "60%",
          padding: "5px",
          minWidth: "100px",
          display: "flex",
          justifyContent: "center",
          paddingRight: "1rem",
        }}
        color="success"
        variant="outlined"
      >
        <span style={{ margin: "0.5rem" }} class="material-symbols-outlined">
          task_alt
        </span>
        Finalizar
      </Button>
    </Stack>
  );
}
