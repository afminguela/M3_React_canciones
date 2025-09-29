import React from "react";
import cancionesData from "../../Canciones.json";
import styles from "./listado.module.css";

function Listado() {
  // Calcular estadísticas
  const totalCanciones = cancionesData.length;
  const promedioValoracion = (
    cancionesData.reduce((sum, cancion) => sum + cancion.valoracion, 0) /
    totalCanciones
  ).toFixed(1);
  const duracionTotal = Math.floor(
    cancionesData.reduce((sum, cancion) => sum + cancion.duracion, 0) / 60
  );

  // Función para formatear duración
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Biblioteca Musical</h2>

      {/* Estadísticas */}
      <div
        className={styles.stats}
        role="region"
        aria-label="Estadísticas de la biblioteca"
      >
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{totalCanciones}</span>
          <span>Canciones</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>★ {promedioValoracion}</span>
          <span>Valoración media</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{duracionTotal}h</span>
          <span>Duración total</span>
        </div>
      </div>

      {/* Lista de canciones */}
      {cancionesData.length === 0 ? (
        <div className={styles.empty} role="status">
          No hay canciones en la biblioteca
        </div>
      ) : (
        <ul className={styles.list} role="list" aria-label="Lista de canciones">
          {cancionesData.map((cancion) => (
            <li key={cancion.id} className={styles.listItem} role="listitem">
              <img
                src={
                  cancion.imagenAlbum ||
                  "https://via.placeholder.com/60x60/E3F2FD/7B1FA2?text=♪"
                }
                alt={`Portada del álbum ${cancion.album}`}
                className={styles.albumImage}
                loading="lazy"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/60x60/E3F2FD/7B1FA2?text=♪";
                }}
              />

              <div className={styles.songInfo}>
                <h3 className={styles.songTitle}>{cancion.titulo}</h3>
                <p className={styles.songArtist}>{cancion.artista}</p>
                <p className={styles.songAlbum}>
                  {cancion.album} • {formatDuration(cancion.duracion)}
                </p>
              </div>

              <div className={styles.songMeta}>
                <div
                  className={styles.rating}
                  aria-label={`Valoración: ${cancion.valoracion} de 5 estrellas`}
                >
                  <span className={styles.star}>★</span>
                  <span>{cancion.valoracion}/5</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Listado;
