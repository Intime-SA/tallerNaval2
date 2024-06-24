import Categorias from "../components/pages/categorias/Categorias";
import ClientForm from "../components/pages/clients/ClientForm";
import Clients from "../components/pages/clients/Clients";
import Compras from "../components/pages/compras/Compras";
import Cuentas from "../components/pages/cuentas/Cuentas";
import Egresos from "../components/pages/egresos/Egresos";
import GastosObraPage from "../components/pages/gastos/GastosObraPage";
import Home from "../components/pages/home/Home";
import GastosHorasPage from "../components/pages/horas/GastosHorasPage";
import Ingresos from "../components/pages/ingresos/Ingresos";
import Obra from "../components/pages/obra/Obra";
import Obras from "../components/pages/obras/Obras";
import Proveedores from "../components/pages/proveedores/Proveedores";
import Reportes from "../components/pages/reportes/Reportes";
import Ventas from "../components/pages/ventas/Ventas";

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
  {
    id: "gastosObraPage",
    path: "/gastosObraPage/:id",
    Element: GastosObraPage,
  },
  {
    id: "gastosHorasPage",
    path: "/gastosHorasPage/:id",
    Element: GastosHorasPage,
  },
  {
    id: "compras",
    path: "/compras",
    Element: Compras,
  },
  {
    id: "ventas",
    path: "/ventas",
    Element: Ventas,
  },
  {
    id: "ingresos",
    path: "/ingresos",
    Element: Ingresos,
  },
  {
    id: "egresos",
    path: "/egresos",
    Element: Egresos,
  },
  {
    id: "cuentasBanco",
    path: "/cuentasBanco",
    Element: Cuentas,
  },
  {
    id: "reportes",
    path: "/reportes",
    Element: Reportes,
  },
];
