import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import AuthContextComponent from "./components/context/AuthContext";
import { TableContextComponent } from "./components/context/TableContext";

function App() {
  return (
    <BrowserRouter>
      <TableContextComponent>
        <AuthContextComponent>
          <AppRouter />
        </AuthContextComponent>
      </TableContextComponent>
    </BrowserRouter>
  );
}

export default App;
