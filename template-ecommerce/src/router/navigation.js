import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import ShopIcon from "@mui/icons-material/Shop";
import ClassIcon from "@mui/icons-material/Class";
import HandshakeIcon from "@mui/icons-material/Handshake";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import FormatListNumberedRoundedIcon from "@mui/icons-material/FormatListNumberedRounded";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PaymentsIcon from "@mui/icons-material/Payments";
import AddCardIcon from "@mui/icons-material/AddCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AssessmentIcon from "@mui/icons-material/Assessment";

export const menuItems = [
  {
    id: "clientes",
    path: "/clientes",
    title: "Clientes",
    Icon: PeopleAltRoundedIcon,
  },

  {
    id: "proveedores",
    path: "/proveedores",
    title: "Proveedores",
    Icon: HandshakeIcon,
  },
  {
    id: "categorias",
    path: "/categorias",
    title: "Categorias",
    Icon: ClassIcon,
  },
];

export const menuItems2 = [
  {
    id: "compras",
    path: "/compras",
    title: "Compras",
    Icon: ReceiptIcon,
  },
  {
    id: "ventas",
    path: "/ventas",
    title: "Ventas",
    Icon: PointOfSaleIcon,
  },
  {
    id: "egresos",
    path: "/egresos",
    title: "Egresos",
    Icon: PaymentsIcon,
  },
  {
    id: "ingresos",
    path: "/ingresos",
    title: "Ingresos",
    Icon: AddCardIcon,
  },
];

export const menuItems3 = [
  {
    id: "home",
    path: "/",
    title: "Inicio",
    Icon: HomeIcon,
  },

  {
    id: "obras",
    path: "/obras",
    title: "Obras",
    Icon: FormatListNumberedRoundedIcon,
  },
];

export const menuItems4 = [
  {
    id: "cuentasBanco",
    path: "/cuentasBanco",
    title: "Cajas y Cuentas",
    Icon: AccountBalanceIcon,
  },
];
