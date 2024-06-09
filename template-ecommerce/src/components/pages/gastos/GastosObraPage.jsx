import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { TableContext } from "../../context/TableContext";
import { useParams } from "react-router-dom";

export default function GastosObraPage() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { gastos, proveedores } = React.useContext(TableContext); // Agregado proveedores al contexto
  const { id } = useParams(); // Obtener el parámetro "id" de la URL

  const [gastosFiltrados, setGastosFiltrados] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null); // Estado para el elemento anclado
  const [selectedGasto, setSelectedGasto] = React.useState(null); // Estado para el gasto seleccionado

  React.useEffect(() => {
    if (gastos && id) {
      const gastosConId = gastos.filter((gasto) => gasto.obraId === id);
      setGastosFiltrados(gastosConId);
    }
  }, [gastos, id]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleMenuClick = (event, gasto) => {
    setAnchorEl(event.currentTarget);
    setSelectedGasto(gasto);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedGasto(null);
  };

  const columns = [
    { id: "fechaGasto", label: "Fecha Comprobante", minWidth: 150 },
    { id: "categoria", label: "Categoría", minWidth: 100 },
    { id: "tipoComprobante", label: "Tipo de Comprobante", minWidth: 100 },
    { id: "numeroComprobante", label: "Número de Comprobante", minWidth: 150 },
    { id: "proveedorId", label: "Proveedor", minWidth: 100 },
    { id: "descripcion", label: "Descripción", minWidth: 150 },
    { id: "montoTotal", label: "Monto Total", minWidth: 100 },
    { id: "acciones", label: "Acciones", minWidth: 50, align: "center" },
  ];

  const renderProveedorNombre = (proveedorId) => {
    const proveedor = proveedores.find((p) => p.id === proveedorId);
    return proveedor ? proveedor.nombreComercio : "N/A";
  };

  return (
    <div style={{ marginLeft: "20rem" }}>
      <h1>Gastos Obra : {id}</h1>
      <Paper sx={{ width: "80%" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || "left"}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {gastosFiltrados
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((gasto) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={gasto.id}>
                    {columns.map((column) => {
                      let value = gasto[column.id];
                      // Formatear las fechas si es necesario
                      if (column.id === "fechaGasto") {
                        value = new Date(
                          value.seconds * 1000
                        ).toLocaleDateString();
                      }
                      // Reemplazar proveedorId por el nombre del proveedor
                      if (column.id === "proveedorId") {
                        value = renderProveedorNombre(value);
                      }
                      // Formatear números como moneda
                      if (
                        column.id === "importe" ||
                        column.id === "montoTotal"
                      ) {
                        value = value.toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        });
                      }
                      // Renderizar el ícono de acciones
                      if (column.id === "acciones") {
                        value = (
                          <div style={{ zIndex: 0 }}>
                            <IconButton
                              aria-label="more"
                              aria-controls="demo-positioned-menu"
                              aria-haspopup="true"
                              onClick={(event) => handleMenuClick(event, gasto)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                            <Menu
                              id="demo-positioned-menu"
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={handleClose}
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                              }}
                            >
                              <MenuItem
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                }}
                              >
                                <span
                                  style={{ margin: "1rem" }}
                                  className="material-symbols-outlined"
                                >
                                  search
                                </span>
                                <h6 style={{ marginTop: "0.5rem" }}>Ver</h6>
                              </MenuItem>
                              <MenuItem
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                }}
                              >
                                <span
                                  style={{ margin: "1rem" }}
                                  className="material-symbols-outlined"
                                >
                                  delete
                                </span>
                                <h6 style={{ marginTop: "0.5rem" }}>
                                  Eliminar
                                </h6>
                              </MenuItem>
                            </Menu>
                          </div>
                        );
                      }
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align || "left"}
                        >
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 25, 100]}
          component="div"
          count={gastosFiltrados.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
