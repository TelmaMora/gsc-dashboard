import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Page from "./app/dashboard/page";
import Pedidos from "./app/pedidos/pedidos";
import Visitas from "./app/visitas/visitas";
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
import PrestamoCajas from "./app/prestamos/PrestamoCajas";
import Recibas from "./app/recibas/Recibas";
import Selecciones from "./app/selecciones/Selecciones";
import ProgramarCorte from "./app/cortes/programa";
import Cortes from "./app/cortes/corte";

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
         <Route path="/programar-corte" element={<ProgramarCorte />} />
        <Route path="/cortes" element={<Cortes />} />
        <Route path="/acopio" element={<Acopio />} />
        <Route path="/prestamo-cajas" element={<PrestamoCajas />} />
        <Route path="/reciba" element={<Recibas />} />
        <Route path="/seleccion" element={<Selecciones />} />

        {/* Catálogos */}
        <Route path="/catalogos/proveedores" element={<CatalogoProveedores />} />
        <Route path="/catalogos/cajas" element={<CatalogoCajas />} />
        <Route path="/catalogos/pallets" element={<CatalogoPallets />} />
        <Route path="/catalogos/cuadrillas" element={<CatalogoCuadrillas />} />
        <Route path="/catalogos/transporte" element={<CatalogoTransporte />} />
        <Route path="/catalogos/programas" element={<CatalogoProgramas />} />
        <Route path="/catalogos/clientes" element={<CatalogoClientes />} />
        <Route path="/catalogos/clasificaciones" element={<CatalogoClasificaciones />} />

        {/* Usuarios */}
        <Route path="/usuarios" element={<CatalogoUsuarios />} />
      </Routes>
    </Router>
  );
}

export default App;
