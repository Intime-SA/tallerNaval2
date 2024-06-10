import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";

export default function AutoCompleteCategory({ setCategoria, categoria }) {
  const [array, setArray] = React.useState([]);

  React.useEffect(() => {
    const consultaCategory = async () => {
      try {
        const collectionCategory = collection(db, "categorias");
        const categorySnapshot = await getDocs(collectionCategory);
        const categoryData = categorySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        // Actualizar el estado con los categorys filtrados
        setArray(categoryData);
      } catch (error) {
        console.error("Error fetching categorys:", error);
      }
    };

    consultaCategory();
  }, []); // Agregar arrayEmpleados como dependencia para que se vuelva a ejecutar cuando cambie

  console.log(array);

  const handleChange = (event) => {
    setCategoria(event.target.value);
    console.log(categoria); // Actualizar el estado con el valor seleccionado
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">
          Seleccionar Categoria
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={categoria} // Establecer el valor seleccionado
          label="Seleccionar Empleado"
          onChange={handleChange}
        >
          {array.map((categoria) => (
            <MenuItem key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
