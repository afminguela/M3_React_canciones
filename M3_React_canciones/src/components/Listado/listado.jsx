import React from "react";
import cancionesData from "../../Canciones.json";
import style from "./listado.module.css";

function Listado() {

    return (
        <div className={style.wrap}>
            <h2>Listado de Canciones</h2>
            <ul className={style.listadoContainer}>
                {cancionesData.map((cancion, index) => (
                    <li key={index} className={style.listItem}>
                        {cancion.titulo} - {cancion.artista}
                    </li>
                ))}
            </ul>
        </div>
    );

};

export default Listado;