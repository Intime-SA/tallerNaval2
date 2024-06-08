import Categorias from "../components/pages/categorias/Categorias";
import ClientForm from "../components/pages/clients/ClientForm";
import Clients from "../components/pages/clients/Clients";
import Home from "../components/pages/home/Home";
import Obra from "../components/pages/obra/Obra";
import Obras from "../components/pages/obras/Obras";
import Proveedores from "../components/pages/proveedores/Proveedores";

export const routes = [
  {
    id: "home",
    path: "/",
    Element: Home,
  },
  {
    id: "obra",
    path: "/obra/:id",
    Element: Obra,
  },
  {
    id: "clientes",
    path: "/clientes",
    Element: Clients,
  },
  {
    id: "proveedores",
    path: "/proveedores",
    Element: Proveedores,
  },
  {
    id: "categorias",
    path: "/categorias",
    Element: Categorias,
  },
  {
    id: "obras",
    path: "/obras",
    Element: Obras,
  },
];
