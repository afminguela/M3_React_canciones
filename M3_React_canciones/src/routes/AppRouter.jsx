import { Routes, Route, Navigate, NavLink, Outlet } from "react-router-dom";
import App from "../App";
import Aficiones from "../components/aficiones/aficiones";
import Listado from "../components/Listado/listado";
import Titulo from "../components/titulo/Titulo";
import Formulario from "../components/formulario/formulario";
import ApiCRUD from "../components/apiCrud/apiCrud";
import styles from "./AppRouter.module.css";

function Layout() {
  return (
    <div className={styles.layout}>
      <a href="#main-content" className={styles.skipLink}>
        Saltar al contenido principal
      </a>
      <header>
        <nav
          className={styles.navigation}
          role="navigation"
          aria-label="Navegación principal"
        >
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <NavLink
                to="/Titulo"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ""}`
                }
                aria-current={({ isActive }) => (isActive ? "page" : undefined)}
              >
                Inicio
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                to="/Aficiones"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ""}`
                }
                aria-current={({ isActive }) => (isActive ? "page" : undefined)}
              >
                Aficiones
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                to="/Listado"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ""}`
                }
                aria-current={({ isActive }) => (isActive ? "page" : undefined)}
              >
                Listado
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                to="/Formulario"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ""}`
                }
                aria-current={({ isActive }) => (isActive ? "page" : undefined)}
              >
                Formulario de contacto
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                to="/CRUD"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ""}`
                }
                aria-current={({ isActive }) => (isActive ? "page" : undefined)}
              >
                CRUD (API)
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <hr className={styles.divider} />
      <main id="main-content" className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
function NotFound() {
  return <p>404 · Ruta no encontrada</p>;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/Titulo" />} />{" "}
        {/* Redirige a /Titulo por defecto */}
        <Route path="Titulo" element={<Titulo />} />
        <Route path="Aficiones" element={<Aficiones />} />
        <Route path="Listado" element={<Listado />} />
        <Route path="Formulario" element={<Formulario />} />
        <Route path="CRUD" element={<ApiCRUD />} />
        <Route path="*" element={<NotFound />} /> {/* Ruta para manejar 404 */}
      </Route>
    </Routes>
  );
}
