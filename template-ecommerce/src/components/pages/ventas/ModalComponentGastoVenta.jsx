import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import AutoCompleteCategory from "../obra/actions/AutocompleteCategory";
import { TextField } from "@mui/material";
import DatePickerComponent from "../obra/actions/DatePickerComponent";
import FadeMenuImpuestos from "../obra/actions/FadeMenuImpuestos";
import SpanningTable from "../obra/actions/SpanningTable";
import "./ModalFont.css";
import AutoCompleteSubCategory from "../obra/actions/AutoCompleteSubCategory";
import FadeMenu from "../obra/actions/FedeMenu";
import { db } from "../../../firebaseConfig";
import AutoCompleteCliente from "../obra/actions/AutocompleteCliente";
import AutoCompleteObras from "../obra/actions/AutoCompleteObras";
import { TableContext } from "../../context/TableContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

export default function ModalComponentVenta({
  openModalVenta,
  setOpenModalVenta,
}) {
  const [cliente, setCliente] = React.useState([]);
  const [concepto, setConcepto] = React.useState("");
  const [subConcepto, setSubConcepto] = React.useState("");
  const [descripcion, setDescripcion] = React.useState("");
  const [monto, setMonto] = React.useState("$0,00");
  const [impuesto, setImpuesto] = React.useState([]);
  const [tipoComprobante, setTipoComprobante] = React.useState("");
  const [numeroComprobante, setNumeroComprobante] = React.useState("");
  const [numeroPuntoVenta, setNumeroPuntoVenta] = React.useState("");
  const [selectedOption2, setSelectedOption2] = React.useState(null);
  const [montoLimpio, setMontoLimpio] = React.useState(null);
  const [openImpuestos, setOpenImpuestos] = React.useState(null);
  const [obrasId, setObrasId] = React.useState("");
  const { gastos } = React.useContext(TableContext);

  const handleClose = () => setOpenModalVenta(false);

  const convertirAFirestoreTimestamp = (selectedOption2) => {
    if (selectedOption2) {
      const fechaJavaScript = selectedOption2.$d;
      const fechaDate = new Date(fechaJavaScript);
      const timestamp = Timestamp.fromDate(fechaDate);
      return timestamp;
    }
  };

  const timestampFirestore = convertirAFirestoreTimestamp(selectedOption2);

  function calcularMontoTotal(importe, impuestos) {
    const totalImpuestos = impuestos.reduce(
      (total, impuesto) => total + impuesto.monto,
      0
    );
    const montoTotal = importe + totalImpuestos;
    return montoTotal;
  }

  const cargaVentaGlobal = async () => {
    try {
      if (!descripcion) {
        console.error("Faltan datos requeridos para cargar el Venta.");
        return;
      }

      const venta = {
        fechaCarga: serverTimestamp(),
        fechaVenta: timestampFirestore,
        concepto: "concepto",
        clienteId: cliente,
        descripcion: descripcion,
        importe: montoLimpio,
        tipoComprobante: tipoComprobante,
        numeroComprobante: numeroComprobante,
        numeroPuntoVenta: numeroPuntoVenta,
        impuestos: impuesto,
        montoTotal: calcularMontoTotal(montoLimpio, impuesto),
        obraId: obrasId,
        pago: "pendiente",
        metodoPago: "",
        cuentaId: "",
      };
      console.log(venta);

      await addDoc(collection(db, "ventas"), venta);

      setOpenModalVenta(false);
      window.location.reload();
    } catch (error) {
      console.error("Error al cargar el Venta global:", error);
    }
  };

  function limpiarYConvertir(numeroConSigno) {
    if (numeroConSigno) {
      const limpio = numeroConSigno.replace(/[$.]/g, "");
      const limpioConPuntos = limpio.replace(",", ".");
      return parseFloat(limpioConPuntos);
    }
    return 0;
  }

  React.useEffect(() => {
    if (obrasId.length > 0) {
      const totalesPorObra = {};

      // Inicializar los totales a 0 para cada obraId
      obrasId.forEach((id) => {
        totalesPorObra[id] = 0;
      });

      // Sumar los importes de los gastos para cada obraId
      gastos.forEach((gasto) => {
        if (obrasId.includes(gasto.obraId)) {
          totalesPorObra[gasto.obraId] += gasto.montoTotal;
        }
      });

      // Mostrar los totales por obraId
      obrasId.forEach((id) => {
        console.log(
          `Total de gastos para la obra ${id}: ${totalesPorObra[id]}`
        );
      });
    }
  }, [obrasId, gastos]); // Asegúrate de incluir 'gastos' en la lista de dependencias si puede cambiar

  const handleMontoChange = (value) => {
    let suma = 0;

    const formattedValue = formatNumber(value);
    setMonto(formattedValue);
    const cleanedValue = limpiarYConvertir(formattedValue);
    setMontoLimpio(cleanedValue);
  };

  const formatNumber = (value) => {
    if (!value) return "$0,00";
    const cleanValue = value.replace(/[^\d]/g, "");
    const numberValue = parseFloat(cleanValue);
    const formattedValue = new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(numberValue / 100);
    return formattedValue;
    2;
  };

  console.log(impuesto);
  return (
    <Modal
      open={openModalVenta}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box>
          <div>
            <h6>Venta Global</h6>
            <span class="material-symbols-outlined">public</span>
          </div>
        </Box>
        <div style={{ display: "flex", alignItems: "center" }}>
          <FadeMenu
            setTipoComprobante={setTipoComprobante}
            tipoComprobante={tipoComprobante}
            setOpenImpuestos={setOpenImpuestos}
          />
          <DatePickerComponent
            setSelectedOption2={setSelectedOption2}
            selectedOption2={selectedOption2}
          />
        </div>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <TextField
            id="numeroPuntoVenta"
            label="N° P.vta"
            variant="standard"
            value={numeroPuntoVenta}
            onChange={(e) => setNumeroPuntoVenta(e.target.value)}
            sx={{ width: "7rem" }}
          />
          <span
            className="material-symbols-outlined"
            style={{ marginTop: "1rem" }}
          >
            remove
          </span>
          <TextField
            id="numeroComprobante"
            label="N°Comprobante"
            variant="standard"
            value={numeroComprobante}
            sx={{ width: "20rem" }}
            onChange={(e) => setNumeroComprobante(e.target.value)}
          />
        </Box>

        <AutoCompleteCliente setCliente={setCliente} cliente={cliente} />

        <AutoCompleteObras setObrasId={setObrasId} cliente={cliente} />
        {/*         <AutoCompleteCategory setConcepto={setConcepto} concepto={concepto} />
        {concepto && (
          <AutoCompleteSubCategory
            setSubConcepto={setSubConcepto}
            subConcepto={subConcepto}
            Concepto={Concepto}
          />
        )} */}

        <TextField
          multiline
          rows={4}
          id="descripcion"
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{ marginBottom: "1rem", marginTop: "2rem" }}
        />
        <TextField
          id="monto"
          label="Subtotal Neto"
          variant="standard"
          value={monto}
          onChange={(e) => handleMontoChange(e.target.value)}
          sx={{ marginBottom: "1rem" }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {openImpuestos && (
            <FadeMenuImpuestos
              setMontoLimpio={setMontoLimpio}
              formatNumber={formatNumber}
              limpiarYConvertir={limpiarYConvertir}
              setImpuesto={setImpuesto}
              impuesto={impuesto}
            />
          )}
        </div>
        <SpanningTable impuesto={impuesto} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: "150%",
            margin: "1rem",
            backgroundColor: "#f7f7f7", // Color de fondo
            padding: "1rem",
            borderRadius: "8px", // Bordes redondeados
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Sombra
          }}
        >
          <p className="bebas-neue-regular" style={{ color: "green" }}>
            TOTAL COMPROBANTE:{" "}
          </p>
          <p
            className="bebas-neue-regular"
            style={{ color: "green", fontWeight: "bold" }}
          >
            {calcularMontoTotal(montoLimpio, impuesto).toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </p>
        </div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1rem",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => cargaVentaGlobal()}
          >
            Cargar Venta
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            Cerrar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
