import React from "react";
import cancionesData from "../../../public/Canciones.json";

function Listado() {

    return (
        <div>
            <h2>Listado de Canciones</h2>
            <ul>
                {cancionesData.map((cancion, index) => (
                    <li key={index}>
                        {cancion.titulo} - {cancion.artista}
                    </li>
                ))}
            </ul>
        </div>
    );

};

export default Listado;