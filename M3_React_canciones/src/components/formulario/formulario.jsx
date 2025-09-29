import { useCallback } from "react";
import styles from "./formulario.module.css";

export default function Formulario() {
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const all = Array.from(form.elements).map((el) => ({
      tag: el.tagName.toLowerCase(),
      type: el.type,
      name: el.name || null,
      id: el.id || null,
      value:
        el.type === "checkbox"
          ? el.checked
          : el.type === "radio"
          ? el.checked
            ? el.value
            : ""
          : el.value,
      disabled: el.disabled || false,
      required: el.required || false,
    }));
    console.log("🧩 Elementos del formulario:", all);

    // 2) Payload desde FormData (maneja múltiples valores con el mismo name)
    const fd = new FormData(form);
    const data = {};
    for (const [key, value] of fd.entries()) {
      if (key in data) {
        if (Array.isArray(data[key])) data[key].push(value);
        else data[key] = [data[key], value];
      } else {
        data[key] = value;
      }
    }
    console.log("📦 Payload FormData:", data);

    // Aquí harías submit a tu API
    // fetch("/api", { method: "POST", body: fd })
  }, []);

  const handleReset = useCallback(() => {
    console.log("↩️ Form reset");
  }, []);

  return (
    <section className={styles.wrap}>
      <header className={styles.header}>
        <h2>Formulario de ejemplo</h2>
        <p className={styles.subtitle}>Validaciones nativas HTML y estilos.</p>
      </header>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
        onReset={handleReset}
        noValidate
      >
        {/* ——— Datos personales ——— */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Datos personales</legend>

          <div className={styles.grid2}>
            <label className={styles.label}>
              Nombre *
              <input
                className={styles.input}
                name="firstName"
                type="text"
                placeholder="jose Luis"
                required
                minLength={2}
                maxLength={40}
                pattern="^[A-Za-zÀ-ÿ'\-\s]+$"
                title="Solo letras, espacios, apóstrofes o guiones"
              />
            </label>

            <label className={styles.label}>
              Apellidos *
              <input
                className={styles.input}
                name="lastName"
                type="text"
                placeholder="López Fernández"
                required
                minLength={2}
                maxLength={60}
                pattern="^[A-Za-zÀ-ÿ'\-\s]+$"
                title="Solo letras, espacios, apóstrofes o guiones"
              />
            </label>

            <label className={styles.label}>
              Email *
              <input
                className={styles.input}
                name="email"
                type="email"
                placeholder="email@dominio.com"
                required
              />
            </label>

            <label className={styles.label}>
              Teléfono
              <input
                className={styles.input}
                name="phone"
                type="tel"
                placeholder="555-1234567"
                pattern="^[+0-9\s\-()]{7,20}$"
                title="Introduce un teléfono válido"
              />
            </label>
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Contacto</legend>
          <div className={styles.grid2}>
            <label className={styles.label}>
              Hora preferida de contacto
              <input className={styles.input} name="contactTime" type="time" />
            </label>
          </div>
        </fieldset>

        {/* ——— Preferencias ——— */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Preferencias</legend>

          <div className={styles.grid2}>
            <label className={styles.label}>
              País *
              <select
                className={styles.select}
                name="country"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Selecciona...
                </option>
                <option value="ES">España</option>
                <option value="AR">Argentina</option>
                <option value="MX">México</option>
                <option value="CO">Colombia</option>
                <option value="CL">Chile</option>
              </select>
            </label>
          </div>

          <label className={styles.label}>
            Mensaje para mi *
            <textarea
              className={styles.textarea}
              name="bio"
              required
              rows={4}
              maxLength={300}
              placeholder="Cuéntanos algo en 300 caracteres…"
            />
          </label>

          <label className={styles.checkboxRow}>
            <input type="checkbox" name="terms" required />
            <span>Acepto términos y condiciones *</span>
          </label>
        </fieldset>

        {/* ——— Acciones ——— */}
        <div className={styles.actions}>
          <button type="reset" className={styles.btnSecondary}>
            Reset
          </button>
          <button type="submit" className={styles.btnPrimary}>
            Enviar
          </button>
        </div>
      </form>
    </section>
  );
}
