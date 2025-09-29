import { useEffect, useMemo, useState } from "react";
import styles from "./apiCrud.module.css";

const API = "https://jsonplaceholder.typicode.com/posts";

// Helpers
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

function toCancion(p) {
  const id = Number(p.id);
  const pseudoDuracion = 180 + (id % 30 || 10); // ~3min
  // rating: si no hay, lo "inventamos" con id y p.rating (si existe)
  // para que parezca más realista (no todos iguales)
  const pseudoValoracion =
    Math.round(((id % 10) + 1 + (p.rating ?? 0)) * 10) / 20; // ~1–10
  return {
    id,
    titulo: cap(p.title ?? "Untitled"),
    album: p.body
      ? cap(p.body.split(" ").slice(0, 3).join(" "))
      : "Unknown Album",
    artista: [],
    valoracion: Number(p.rating ?? pseudoValoracion.toFixed(1)),
    poster: "",
    duracion: pseudoDuracion,
  };
}

export default function ApiCRUD() {
  // ---- Estado base ----
  const [canciones, setCanciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---- Filtros / orden (compatibles con tu estilo) ----
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("valoracion");
  const [sortDir, setSortDir] = useState("desc"); // asc | desc
  const [minValoracion, setMinValoracion] = useState(0);

  // ---- Formulario (Create/Update) ----
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    duracion: "",
    valoracion: "",
    album: "",
  });

  // ---- READ: carga inicial ----
  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const res = await fetch(`${API}?_limit=12`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (canceled) return;
        setCanciones((Array.isArray(data) ? data : []).map(toCancion));
        setError(null);
      } catch (e) {
        if (!canceled) setError(e.message || "Error cargando API");
      } finally {
        if (!canceled) setLoading(false);
      }
    })();
    return () => {
      canceled = true;
    };
  }, []);

  // ---- Derivados ----
  const filteredSorted = useMemo(() => {
    const f = canciones
      .filter((m) =>
        m.titulo.toLowerCase().includes(query.trim().toLowerCase())
      )
      .filter((m) => Number(m.valoracion ?? 0) >= Number(minValoracion));

    const s = [...f].sort((a, b) => {
      let comp = 0;
      if (sortBy === "valoracion")
        comp = Number(a.valoracion ?? 0) - Number(b.valoracion ?? 0);
      else if (sortBy === "duracion")
        comp = Number(a.duracion ?? 0) - Number(b.duracion ?? 0);
      else if (sortBy === "titulo") comp = a.titulo.localeCompare(b.titulo);
      return sortDir === "asc" ? comp : -comp;
    });
    return s;
  }, [canciones, query, minValoracion, sortBy, sortDir]);

  const stats = useMemo(() => {
    if (!canciones.length) return { count: 0, avgValoracion: 0, best: null };
    const total = canciones.reduce(
      (s, m) => s + (Number(m.valoracion) || 0),
      0
    );
    const avgValoracion = total / canciones.length;
    const best = canciones.reduce(
      (acc, m) =>
        Number(m.valoracion ?? -1) > Number(acc?.valoracion ?? -1) ? m : acc,
      null
    );
    return { count: canciones.length, avgValoracion, best };
  }, [canciones]);

  // ---- Handlers Form ----
  const startCreate = () => {
    setEditingId(null);
    setForm({ titulo: "", duracion: "", valoracion: "", album: "" });
  };

  const startEdit = (m) => {
    setEditingId(m.id);
    setForm({
      titulo: m.titulo ?? "",
      duracion: m.duracion ?? "",
      valoracion: m.valoracion ?? "",
      album: m.album ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // ---- CREATE / UPDATE ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    // validación HTML nativa:
    const formEl = e.currentTarget;
    if (!formEl.checkValidity()) {
      formEl.reportValidity();
      return;
    }

    const payload = {
      titulo: form.titulo.trim(),
      duracion: form.duracion.trim(),
      valoracion: Number(form.valoracion) || undefined,
      album: form.album.trim(),
    };

    try {
      if (editingId == null) {
        // CREATE
        const res = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const created = await res.json();
        const cancion = toCancion({ ...payload, id: created.id ?? Date.now() });
        setCanciones((prev) => [cancion, ...prev]);
      } else {
        // UPDATE
        const res = await fetch(`${API}/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const updated = await res.json();
        setCanciones((prev) =>
          prev.map((m) =>
            m.id === editingId ? toCancion({ ...m, ...updated }) : m
          )
        );
      }
      // reset form
      setEditingId(null);
      setForm({ titulo: "", duracion: "", valoracion: "", album: "" });
      setError(null);
    } catch (e2) {
      setError(e2.message || "Error enviando datos");
    }
  };

  // ---- DELETE ----
  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que quieres borrar esta canción?")) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setCanciones((prev) => prev.filter((m) => m.id !== id));
    } catch (e2) {
      setError(e2.message || "Error borrando");
    }
  };

  if (loading)
    return (
      <div className={styles.loading} role="status" aria-live="polite">
        Cargando canciones...
      </div>
    );
  if (error)
    return (
      <div className={styles.error} role="alert" aria-live="assertive">
        Error: {error}
      </div>
    );

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Gestión de Canciones</h1>
        <p className={styles.subtitle}>
          CRUD con API pública - JSONPlaceholder
        </p>
        <div className={styles.cardMeta}>
          <span>
            Total: <strong>{stats.count}</strong>
          </span>
          <span>
            Promedio ★ <strong>{stats.avgValoracion.toFixed(2)}</strong>
          </span>
          {stats.best && (
            <span>
              Top:{" "}
              <strong>
                {stats.best.titulo} ({stats.best.valoracion})
              </strong>
            </span>
          )}
        </div>
      </header>

      {/* Form Section */}
      <section className={styles.formSection}>
        <h2 className={styles.formTitle}>
          {editingId == null ? "Crear Nueva Canción" : "Editar Canción"}
        </h2>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.inputGroup}>
            <label htmlFor="titulo" className={styles.label}>
              Título *
            </label>
            <input
              id="titulo"
              className={styles.input}
              name="titulo"
              placeholder="Ingresa el título de la canción"
              value={form.titulo}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={100}
              aria-describedby="titulo-help"
            />
            <small id="titulo-help" className={styles.srOnly}>
              El título es obligatorio y debe tener entre 2 y 100 caracteres
            </small>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="duracion" className={styles.label}>
              Duración (minutos)
            </label>
            <input
              id="duracion"
              className={styles.input}
              name="duracion"
              type="number"
              placeholder="180"
              value={form.duracion}
              onChange={handleChange}
              min="1"
              max="500"
              step="1"
              aria-describedby="duracion-help"
            />
            <small id="duracion-help" className={styles.srOnly}>
              Duración en minutos, entre 1 y 500
            </small>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="valoracion" className={styles.label}>
              Valoración (0-5)
            </label>
            <input
              id="valoracion"
              className={styles.input}
              name="valoracion"
              type="number"
              placeholder="4.5"
              value={form.valoracion}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              aria-describedby="valoracion-help"
            />
            <small id="valoracion-help" className={styles.srOnly}>
              Valoración entre 0 y 5 estrellas
            </small>
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label htmlFor="album" className={styles.label}>
              Álbum
            </label>
            <input
              id="album"
              className={styles.input}
              name="album"
              placeholder="Nombre del álbum"
              value={form.album}
              onChange={handleChange}
              maxLength={300}
            />
          </div>

          <div className={`${styles.cardActions} ${styles.fullWidth}`}>
            <button
              type="submit"
              className={`${styles.button} ${styles.buttonSuccess}`}
              aria-describedby="submit-help"
            >
              {editingId == null ? "Crear Canción" : "Guardar Cambios"}
            </button>
            {editingId != null && (
              <button
                type="button"
                onClick={startCreate}
                className={`${styles.button} ${styles.buttonSecondary}`}
              >
                Cancelar Edición
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Controls Section */}
      <section className={styles.controls}>
        <div className={styles.inputGroup}>
          <label htmlFor="search" className={styles.label}>
            Buscar canciones
          </label>
          <input
            id="search"
            className={`${styles.input} ${styles.searchInput}`}
            placeholder="Buscar por título..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-describedby="search-help"
          />
          <small id="search-help" className={styles.srOnly}>
            Filtra las canciones por título
          </small>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="minValoracion" className={styles.label}>
            Valoración mínima
          </label>
          <input
            id="minValoracion"
            className={styles.input}
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={minValoracion}
            onChange={(e) => setMinValoracion(e.target.value)}
            aria-describedby="rating-help"
          />
          <small id="rating-help" className={styles.srOnly}>
            Muestra solo canciones con esta valoración o superior
          </small>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="sortBy" className={styles.label}>
            Ordenar por
          </label>
          <select
            id="sortBy"
            className={styles.input}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="valoracion">Valoración</option>
            <option value="duracion">Duración</option>
            <option value="titulo">Título</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="sortDir" className={styles.label}>
            Dirección
          </label>
          <select
            id="sortDir"
            className={styles.input}
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value)}
          >
            <option value="desc">Descendente</option>
            <option value="asc">Ascendente</option>
          </select>
        </div>
      </section>

      {/* Results */}
      {filteredSorted.length === 0 ? (
        <div className={styles.empty} role="status">
          No se encontraron canciones con los filtros aplicados.
        </div>
      ) : (
        <section>
          <h2 className={styles.srOnly}>Lista de canciones</h2>
          <div className={styles.grid}>
            {filteredSorted.map((m) => (
              <article key={m.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{m.titulo}</h3>
                </div>
                <img
                  src={
                    m.poster ||
                    `https://placehold.co/300x200/E3F2FD/7B1FA2?text=${encodeURIComponent(
                      m.titulo || "Canción"
                    )}`
                  }
                  alt={`Portada del álbum "${m.album}" de ${
                    (m.artista || []).join(", ") || "Artista desconocido"
                  }`}
                  className={styles.cardImage}
                  loading="lazy"
                  onError={(e) => {
                    // Fallback más elaborado si falla la imagen
                    const canvas = document.createElement("canvas");
                    canvas.width = 300;
                    canvas.height = 200;
                    const ctx = canvas.getContext("2d");

                    // Gradiente de fondo
                    const gradient = ctx.createLinearGradient(0, 0, 300, 200);
                    gradient.addColorStop(0, "#E3F2FD");
                    gradient.addColorStop(0.5, "#BBDEFB");
                    gradient.addColorStop(1, "#E3F2FD");
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, 300, 200);

                    // Texto principal
                    ctx.fillStyle = "#7B1FA2";
                    ctx.font = "bold 18px Arial";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";

                    // Título de la canción (máximo 20 caracteres)
                    const title = (m.titulo || "Canción").substring(0, 20);
                    ctx.fillText(title, 150, 80);

                    // Artista
                    ctx.font = "14px Arial";
                    ctx.fillStyle = "#616161";
                    const artist = (
                      (m.artista || []).join(", ") || "Artista desconocido"
                    ).substring(0, 25);
                    ctx.fillText(artist, 150, 110);

                    // Icono musical
                    ctx.font = "30px Arial";
                    ctx.fillStyle = "#7B1FA2";
                    ctx.fillText("♪", 150, 140);

                    e.target.src = canvas.toDataURL();
                  }}
                />
                <div className={styles.cardMeta}>
                  {m.duracion ? `${m.duracion} min` : "N/A"} •
                  {(m.artista || []).join(", ") || "Artista desconocido"} • ★{" "}
                  {m.valoracion ?? "N/A"}
                </div>
                <div className={styles.cardContent}>
                  <strong>Álbum:</strong> {m.album || "Álbum desconocido"}
                </div>
                <div className={styles.cardActions}>
                  <button
                    type="button"
                    onClick={() => startEdit(m)}
                    className={`${styles.button} ${styles.buttonPrimary}`}
                    aria-label={`Editar canción ${m.titulo}`}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(m.id)}
                    className={`${styles.button} ${styles.buttonDanger}`}
                    aria-label={`Eliminar canción ${m.titulo}`}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
