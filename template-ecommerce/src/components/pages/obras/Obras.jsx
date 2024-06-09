import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { Alert, AlertTitle, Button, Menu, MenuItem } from "@mui/material";
import { db } from "../../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import FormattedDate from "./fechas/FormattedDate";
import ClienteName from "./clientes/ClienteName";
import HorasAcumuladas from "./horas/HorasAcumuladas";
import GastosAcumulados from "./gastos/GastosAcumulados";
import { useNavigate } from "react-router-dom";

function createData(
  id,
  name,
  calories,
  fat,
  carbs,
  protein,
  status,
  montoActual,
  accions
) {
  return {
    id,
    name,
    calories,
    fat,
    carbs,
    protein,
    status,
    montoActual,
    accions,
  };
}

const estadoRender = (estado) => {
  if (estado === "Nueva") {
    return (
      <Alert severity="warning">
        <AlertTitle style={{ marginTop: "10%", fontSize: "75%" }}>
          Nueva
        </AlertTitle>
        {/* <strong>El pedido ya fue preparado</strong> */}
      </Alert>
    );
  } else if (estado === "enProceso") {
    return (
      <Alert style={{ fontSize: "75%" }} size="small" severity="info">
        En Proceso
      </Alert>
    );
  } else if (estado === "Pausada") {
    return (
      <Alert severity="success">
        <AlertTitle
          style={{ marginTop: "10%", fontSize: "75%" }}
          variant="outlined"
        >
          En Pausa
        </AlertTitle>
        {/* <strong>El pedido fue entregado con exito</strong> */}
      </Alert>
    );
  } else if (estado === "Cancelada") {
    return (
      <Alert variant="outlined" severity="success">
        <AlertTitle style={{ marginTop: "10%", fontSize: "75%" }}>
          Cancelada
        </AlertTitle>
        {/* <strong>El pedido fue entregado con exito</strong> */}
      </Alert>
    );
  } else if (estado === "Finalizada") {
    return (
      <Alert variant="outlined" severity="error">
        Finalizada
      </Alert>
    );
  } else if (estado === "Archivada") {
    return (
      <Alert variant="contained" color="info">
        <AlertTitle>Archivada</AlertTitle>
      </Alert>
    );
  }
};

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "",
  },
  {
    id: "fecha",
    numeric: false,
    disablePadding: true,
    label: "Fecha Inicio",
  },
  {
    id: "calories",
    numeric: true,
    disablePadding: false,
    label: "Cliente",
  },
  {
    id: "fat",
    numeric: true,
    disablePadding: false,
    label: "Horas",
  },
  {
    id: "carbs",
    numeric: true,
    disablePadding: false,
    label: "Gastos",
  },
  {
    id: "lugar",
    numeric: false,
    disablePadding: false,
    label: "Lugar",
  },
  {
    id: "montoActual",
    numeric: true,
    disablePadding: false,
    label: "Presupuesto Inicial",
  },

  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "Estado",
  },
  {
    id: "accions",
    numeric: true,
    disablePadding: false,
    label: "Acciones",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          PANEL DE CONTROL
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function Obras() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [arrayObras, setArrayObras] = React.useState([]);
  const [actualizarObras, setActualizarObras] = React.useState(false);

  React.useEffect(() => {
    const consultaObras = async () => {
      try {
        const collectionObras = collection(db, "obras");
        const obrasSnapshot = await getDocs(collectionObras);
        const obrasData = obrasSnapshot.docs.map((obra) => ({
          id: obra.id,
          ...obra.data(),
        }));
        setArrayObras(obrasData);
      } catch (error) {
        console.error("Error fetching obras:", error);
      }
    };

    consultaObras();
  }, [actualizarObras]);

  console.log(arrayObras);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = arrayObras.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  console.log(selected);

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClickSelect = (id) => {
    console.log(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const FormattedDate = ({ timestamp }) => {
    // Convertir segundos y nanosegundos a milisegundos totales
    const totalMilliseconds =
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6;

    // Crear un objeto de fecha con el total de milisegundos
    const date = new Date(totalMilliseconds);

    // Formatear la fecha a DD/MM/YYYY
    const formattedDate = date.toLocaleDateString("en-GB"); // 'en-GB' formatea la fecha como DD/MM/YYYY

    return <div>{formattedDate}</div>;
  };

  console.log(arrayObras);

  const formattedGastos = (total) => {
    return total.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    });
  };

  return (
    <Box sx={{ width: "70%", marginLeft: "20vw" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {arrayObras.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={() => navigate(`/obra/${row.id}`)}
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: "pointer", position: "relative" }}
                  >
                    <TableCell padding="checkbox" sx={{ zIndex: 1 }}>
                      <Checkbox
                        onClick={(event) => {
                          event.stopPropagation(); // Evita que el onClick del TableRow se dispare
                          handleClickSelect(row.id);
                        }}
                        color="primary"
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      <FormattedDate timestamp={row.fechaInicio} />
                    </TableCell>
                    <TableCell align="right">
                      <ClienteName clienteId={row.cliente}></ClienteName>
                    </TableCell>
                    <TableCell>
                      <HorasAcumuladas horasEmpleado={row.horasEmpleado} />
                    </TableCell>
                    <TableCell>
                      <GastosAcumulados obraId={row.id} />
                    </TableCell>
                    <TableCell align="left">{row.lugar}</TableCell>
                    <TableCell align="right">
                      {formattedGastos(row.presupuestoInicial)}
                    </TableCell>

                    <TableCell align="right">
                      {estadoRender(row.estado)}
                    </TableCell>
                    <TableCell align="right">
                      <div style={{ zIndex: 0 }}>
                        <Button
                          id="demo-positioned-button"
                          aria-controls={
                            open ? "demo-positioned-menu" : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                          sx={{ zIndex: 1 }}
                          onClick={(event) => {
                            event.stopPropagation(), handleClick();
                          }}
                        >
                          <span className="material-symbols-outlined">
                            more_vert
                          </span>
                        </Button>
                        <Menu
                          id="demo-positioned-menu"
                          open={open}
                          onClose={handleClose} // Cierra el menú cuando se selecciona una opción o se hace clic fuera del menú
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
                            /* onClick={() => handleChangeStatus("empaquetada", row.id)} */
                          >
                            <span
                              style={{ margin: "1rem" }}
                              class="material-symbols-outlined"
                            >
                              check_circle
                            </span>
                            <h6 style={{ marginTop: "0.5rem" }}>Finalizar</h6>
                          </MenuItem>

                          <MenuItem
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                              alignItems: "center",
                            }}
                            /* onClick={() => handleChangeStatus("enviada", row.id)} */
                          >
                            <span
                              style={{ margin: "1rem" }}
                              class="material-symbols-outlined"
                            >
                              block
                            </span>
                            <h6 style={{ marginTop: "0.5rem" }}>Cancelar</h6>
                          </MenuItem>
                        </Menu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
