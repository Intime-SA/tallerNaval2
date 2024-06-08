import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";

export default function FadeMenuImpuestos({
  setTipoImpuesto,
  setOpenImpuestos,
  tipoImpuesto,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleImpuestos = (value) => {
    setTipoImpuesto(value);
  };

  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        style={{ marginTop: "1rem" }}
      >
        {tipoImpuesto ? (
          tipoImpuesto
        ) : (
          <>
            <span class="material-symbols-outlined">arrow_drop_down</span>
          </>
        )}
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={() => handleImpuestos("ticket")}>
          Ticket (excento)
        </MenuItem>
        <MenuItem onClick={() => handleImpuestos("IVA27")}>IVA 27,00%</MenuItem>
        <MenuItem onClick={() => handleImpuestos("IVA21")}>IVA 21,00%</MenuItem>
        <MenuItem onClick={() => handleImpuestos("IVA10")}>IVA 10,50%</MenuItem>
        <MenuItem onClick={() => handleImpuestos("IVA2")}>IVA 02,50%</MenuItem>
        <MenuItem onClick={() => handleImpuestos("IIBB")}>IIBB</MenuItem>
        <MenuItem onClick={() => handleImpuestos("PERCEPCION")}>
          Percepcion
        </MenuItem>
      </Menu>
    </div>
  );
}
