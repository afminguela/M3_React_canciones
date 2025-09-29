// src/components/ApiMovieCRUD/ApiMovieCRUD.jsx
import { useEffect, useMemo, useState } from "react";
import styles from "./apiCrud.module.css"; 

const API = "https://jsonplaceholder.typicode.com/posts";

// Helpers
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

function toCancion(p) {
  const id = Number(p.id);
  const pseudoDuracion = 180 + ((id % 30) || 10); // 1990–2019 aprox
  const pseudoValoracion = Math.round((((id % 10) + 1) + (p.rating ?? 0)) * 10) / 20; // ~1–10
  return {
    id,
    titulo: cap(p.title ?? "Untitled"),
    año: Number(p.year ?? pseudoYear),
    generos: [], // la API no tiene géneros
    calificacion: Number(p.rating ?? pseudoRating.toFixed(1)),
    poster: "", // sin imagen en esta API
    plot: p.body ?? "",
  };
}

export default function ApiCRUD() {
  // ---- Estado base ----
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---- Filtros / orden (compatibles con tu estilo) ----
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating"); // rating | year | title
  const [sortDir, setSortDir] = useState("desc"); // asc | desc
  const [minRating, setMinRating] = useState(0);

  // ---- Formulario (Create/Update) ----
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    year: "",
    rating: "",
    plot: "",
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
        setMovies((Array.isArray(data) ? data : []).map(toMovie));
        setError(null);
      } catch (e) {
        if (!canceled) setError(e.message || "Error cargando API");
      } finally {
        if (!canceled) setLoading(false);
      }
    })();
    return () => { canceled = true; };
  }, []);

  // ---- Derivados ----
  const filteredSorted = useMemo(() => {
    const f = movies
      .filter(m => m.title.toLowerCase().includes(query.trim().toLowerCase()))
      .filter(m => Number(m.rating ?? 0) >= Number(minRating));

    const s = [...f].sort((a, b) => {
      let comp = 0;
      if (sortBy === "rating") comp = Number(a.rating ?? 0) - Number(b.rating ?? 0);
      else if (sortBy === "year") comp = Number(a.year ?? 0) - Number(b.year ?? 0);
      else if (sortBy === "title") comp = a.title.localeCompare(b.title);
      return sortDir === "asc" ? comp : -comp;
    });
    return s;
  }, [movies, query, minRating, sortBy, sortDir]);

  const stats = useMemo(() => {
    if (!movies.length) return { count: 0, avgRating: 0, best: null };
    const total = movies.reduce((s, m) => s + (Number(m.rating) || 0), 0);
    const avgRating = total / movies.length;
    const best = movies.reduce((acc, m) =>
      (Number(m.rating ?? -1) > Number(acc?.rating ?? -1) ? m : acc), null);
    return { count: movies.length, avgRating, best };
  }, [movies]);

  // ---- Handlers Form ----
  const startCreate = () => {
    setEditingId(null);
    setForm({ title: "", year: "", rating: "", plot: "" });
  };

  const startEdit = (m) => {
    setEditingId(m.id);
    setForm({
      title: m.title ?? "",
      year: m.year ?? "",
      rating: m.rating ?? "",
      plot: m.plot ?? "",
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
      title: form.title.trim(),
      body: form.plot.trim(),
      year: Number(form.year) || undefined,
      rating: Number(form.rating) || undefined,
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
        const created = await res.json(); // id simulado por la API
        const movie = toMovie({ ...payload, id: created.id ?? Date.now() });
        setMovies((prev) => [movie, ...prev]); // añadimos arriba
      } else {
        // UPDATE
        const res = await fetch(`${API}/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const updated = await res.json();
        setMovies((prev) =>
          prev.map((m) => (m.id === editingId ? toMovie({ ...m, ...updated }) : m))
        );
      }
      // reset form
      setEditingId(null);
      setForm({ title: "", year: "", rating: "", plot: "" });
      setError(null);
    } catch (e2) {
      setError(e2.message || "Error enviando datos");
    }
  };

  // ---- DELETE ----
  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que quieres borrar esta película?")) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMovies((prev) => prev.filter((m) => m.id !== id));
    } catch (e2) {
      setError(e2.message || "Error borrando");
    }
  };

  if (loading) return <p className={styles.status}>Cargando…</p>;
  if (error)   return <p className={styles.error}>Error: {error}</p>;

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <h2>Películas — CRUD (API pública)</h2>
        <div className={styles.stats}>
          <span>Total: <strong>{stats.count}</strong></span>
          <span>Promedio ★ <strong>{stats.avgRating.toFixed(2)}</strong></span>
          {stats.best && (
            <span>Top: <strong>{stats.best.title} ({stats.best.rating})</strong></span>
          )}
        </div>
      </header>

      {/* ---- Formulario Create/Update ---- */}
      <form className={styles.controls} onSubmit={handleSubmit} noValidate>
        <input
          className={styles.input}
          name="title"
          placeholder="Título *"
          value={form.title}
          onChange={handleChange}
          required
          minLength={2}
          maxLength={100}
        />
        <input
          className={styles.number}
          name="year"
          type="number"
          placeholder="Año"
          value={form.year}
          onChange={handleChange}
          min="1900"
          max="2099"
          step="1"
        />
        <input
          className={styles.number}
          name="rating"
          type="number"
          placeholder="Rating 0–10"
          value={form.rating}
          onChange={handleChange}
          min="0"
          max="10"
          step="0.1"
        />
        <input
          className={styles.input}
          name="plot"
          placeholder="Sinopsis"
          value={form.plot}
          onChange={handleChange}
          minLength={0}
          maxLength={300}
        />
        <button
          type="submit"
          style={{ padding: ".55rem .9rem", borderRadius: ".55rem", border: "1px solid #cbd5e1" }}
        >
          {editingId == null ? "Crear" : "Guardar cambios"}
        </button>
        {editingId != null && (
          <button
            type="button"
            onClick={startCreate}
            style={{ padding: ".55rem .9rem", borderRadius: ".55rem", border: "1px solid #cbd5e1", background: "#f8fafc" }}
          >
            Cancelar
          </button>
        )}
      </form>

      {/* ---- Filtros simples ---- */}
      <div className={styles.controls}>
        <input
          className={styles.input}
          placeholder="Buscar por título…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label className={styles.row}>
          Min ★
          <input
            className={styles.number}
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
          />
        </label>
        <label className={styles.row}>
          Ordenar por
          <select
            className={styles.select}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating">rating</option>
            <option value="year">year</option>
            <option value="title">title</option>
          </select>
        </label>
        <label className={styles.row}>
          Dirección
          <select
            className={styles.select}
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value)}
          >
            <option value="desc">desc</option>
            <option value="asc">asc</option>
          </select>
        </label>
      </div>

      {/* ---- Grid de tarjetas ---- */}
      <ul className={styles.grid}>
        {filteredSorted.map((m) => (
          <li key={m.id} className={styles.card}>
            <img
              className={styles.poster}
              src={m.poster || "https://via.placeholder.com/300x450?text=No+Image"}
              alt={`Póster de ${m.title}`}
              loading="lazy"
              onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/300x450?text=No+Image"; }}
            />
            <div className={styles.body}>
              <h3 className={styles.title}>{m.title}</h3>
              <p className={styles.meta}>
                {(m.year ?? "N/A")} • {(m.genres || []).join(", ") || "—"} • ★ {m.rating ?? "N/A"}
              </p>
              <p className={styles.plot}>{m.plot}</p>
              <div style={{ display: "flex", gap: ".5rem", marginTop: ".5rem" }}>
                <button
                  type="button"
                  onClick={() => startEdit(m)}
                  style={{ padding: ".35rem .7rem", borderRadius: ".5rem", border: "1px solid #cbd5e1" }}
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(m.id)}
                  style={{ padding: ".35rem .7rem", borderRadius: ".5rem", border: "1px solid #cbd5e1", background: "#fee2e2" }}
                >
                  Borrar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}