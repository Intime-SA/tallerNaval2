import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import ShopIcon from "@mui/icons-material/Shop";
import ClassIcon from "@mui/icons-material/Class";
import HandshakeIcon from "@mui/icons-material/Handshake";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import FormatListNumberedRoundedIcon from "@mui/icons-material/FormatListNumberedRounded";
export const menuItems = [
  {
    id: "home",
    path: "/",
    title: "Inicio",
    Icon: HomeIcon,
  },
  {
    id: "clientes",
    path: "/clientes",
    title: "Clientes",
    Icon: PeopleAltRoundedIcon,
  },
  {
    id: "obras",
    path: "/obras",
    title: "Obras",
    Icon: FormatListNumberedRoundedIcon,
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
