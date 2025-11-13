import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Page from "./app/dashboard/page";
import Pedidos from "./app/pedidos/pedidos";
import Visitas from "./app/visitas/visitas";
import Cortes from "./app/cortes/programa";
import Acopio from "./app/acopio/acopio";
import CatalogoProveedores from "./app/catalogos/Proveedores";
import CatalogoCajas from "./app/catalogos/Cajas";
import CatalogoPallets from "./app/catalogos/Pallets";
import CatalogoTransporte from "./app/catalogos/Transporte";
import CatalogoCuadrillas from "./app/catalogos/Cuadrillas";
import CatalogoProgramas from "./app/catalogos/Programas";
import SignUp from "./app/signup/page";
import Login from "./app/login/page";
import CatalogoClientes from "./app/catalogos/Clientes";
import CatalogoClasificaciones from "./app/catalogos/clasificaciones";
import CatalogoUsuarios from "./app/usuarios/usuarios";
/* import Pedidos from "@/pages/Pedidos";
import Visitas from "@/pages/Visitas";
import Cortes from "@/pages/Cortes";
import Acopio from "@/pages/Acopio";
import Cajas from "@/pages/catalogos/Cajas";
import Pallets from "@/pages/catalogos/Pallets";
import Proveedores from "@/pages/catalogos/Proveedores";
import Cuadrillas from "@/pages/catalogos/Cuadrillas";
import Transporte from "@/pages/catalogos/Transporte";
import Programas from "@/pages/Programas";
import HistoricoProveedores from "@/pages/HistoricoProveedores";
import Mallas from "@/pages/Mallas"; */

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        {/* Operación */}
        <Route path="/dashboard" element={<Page />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/visitas" element={<Visitas />} />
        <Route path="/cortes" element={<Cortes />} />
        <Route path="/acopio" element={<Acopio />} />

        <Route path="/catalogos/proveedores" element={<CatalogoProveedores />} />
        <Route path="/catalogos/cajas" element={<CatalogoCajas />} />
        <Route path="/catalogos/pallets" element={<CatalogoPallets />} />
        <Route path="/catalogos/cuadrillas" element={<CatalogoCuadrillas />} />
        <Route path="/catalogos/transporte" element={<CatalogoTransporte />} />
        <Route path="/catalogos/programas" element={<CatalogoProgramas />} />
        <Route path="/catalogos/clientes" element={<CatalogoClientes />} />
        <Route path="/catalogos/clasificaciones" element={<CatalogoClasificaciones />} />

        <Route path="/usuarios" element={<CatalogoUsuarios />} />

        {/* Programas e histórico */}
        {/* <Route path="/programas" element={<Programas />} />
          <Route path="/historico-proveedores" element={<HistoricoProveedores />} />
          <Route path="/mallas" element={<Mallas />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
