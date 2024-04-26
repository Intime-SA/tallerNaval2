import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import ShopIcon from "@mui/icons-material/Shop";
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
    Icon: StoreIcon,
  },
  {
    id: "obras",
    path: "/obras",
    title: "Obras",
    Icon: ShoppingCartCheckoutIcon,
  },
  {
    id: "proveedores",
    path: "/proveedores",
    title: "Proveedores",
    Icon: ShopIcon,
  },
];
