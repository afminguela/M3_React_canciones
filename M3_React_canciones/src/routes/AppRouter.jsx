import { Routes, Route, Navigate, NavLink, Outlet } from "react-router-dom"; // 1. Importamos lo que necesitamos de react-router-dom
import App from "../App";
import Aficiones from "../components/Aficiones/Aficiones";
import Listado from "../components/Listado/listado";
import Titulo from "../components/titulo/Titulo";

// 2. Creamos un componente de Layout para la navegación común
function Layout() {
    return (
  <div>
    <nav>
      <ul>
        <li>
          <NavLink to="/Titulo">Título</NavLink>
        </li>
        <li>
          <NavLink to="/Aficiones">Aficiones</NavLink>
        </li>
        <li>
          <NavLink to="/Listado">Listado</NavLink>
        </li>
        <li>
          <NavLink to="/Formulario">Formulario de contacto</NavLink>
        </li>
      </ul>
    </nav>
    <hr />
    <Outlet /> {/* Aquí se renderizarán las rutas hijas */}
  </div>
);
}
function NotFound() {
  return <p>404 · Ruta no encontrada</p>;
}


export default function AppRouter () {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/Titulo" />} /> {/* Redirige a /Titulo por defecto */}
        <Route path="Titulo" element={<Titulo />} />
        <Route path="Aficiones" element={<Aficiones />} />
        <Route path="Listado" element={<Listado />} />
      <Route path="Formulario de contacto" element={<Formulario />} />
        <Route path="*" element={<NotFound />} /> {/* Ruta para manejar 404 */}
      </Route>
    </Routes>
  );
}