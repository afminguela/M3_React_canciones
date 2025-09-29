import { useCallback, useState } from "react";
import styles from "./formulario.module.css";

export default function Formulario() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    favoriteGenre: "",
    favoriteSong: "",
    favoriteArtist: "",
    musicExperience: "",
    newsletter: false,
    terms: false,
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
      case "lastName": {
        return value.length >= 2 ? "" : "Debe tener al menos 2 caracteres";
      }
      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? "" : "Email inválido";
      }
      case "phone": {
        const phoneRegex = /^[0-9+\-\s()]{9,15}$/;
        return phoneRegex.test(value) ? "" : "Teléfono inválido";
      }
      case "terms": {
        return value ? "" : "Debes aceptar los términos y condiciones";
      }
      default:
        return "";
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Validar en tiempo real
    const error = validateField(name, newValue);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      // Validar todos los campos
      const newErrors = {};
      Object.keys(formData).forEach((key) => {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      });

      // Validar campos requeridos
      if (!formData.firstName) newErrors.firstName = "Campo requerido";
      if (!formData.lastName) newErrors.lastName = "Campo requerido";
      if (!formData.email) newErrors.email = "Campo requerido";
      if (!formData.favoriteSong) newErrors.favoriteSong = "Campo requerido";
      if (!formData.terms) newErrors.terms = "Debes aceptar los términos";

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        console.log("✅ Formulario válido:", formData);
        setIsSubmitted(true);

        // Simular envío
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            favoriteGenre: "",
            favoriteSong: "",
            favoriteArtist: "",
            musicExperience: "",
            newsletter: false,
            terms: false,
            message: "",
          });
        }, 3000);
      }
    },
    [formData]
  );

  const handleReset = useCallback(() => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      favoriteGenre: "",
      favoriteSong: "",
      favoriteArtist: "",
      musicExperience: "",
      newsletter: false,
      terms: false,
      message: "",
    });
    setErrors({});
    setIsSubmitted(false);
  }, []);

  if (isSubmitted) {
    return (
      <section className={styles.container}>
        <div className={styles.successMessage}>
          ¡Gracias por compartir tu música favorita! Hemos recibido tu mensaje.
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <header>
        <h2 className={styles.title}>Formulario de Contacto Musical</h2>
        <p className={styles.subtitle}>
          Cuéntanos sobre tu música favorita y conectemos a través de la música
        </p>
      </header>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
        onReset={handleReset}
        noValidate
        aria-label="Formulario de contacto musical"
      >
        {/* Datos Personales */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Datos Personales</legend>

          <div className={styles.inputGroup}>
            <label
              htmlFor="firstName"
              className={`${styles.label} ${styles.required}`}
            >
              Nombre
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className={styles.input}
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Tu nombre"
              required
              aria-describedby={
                errors.firstName ? "firstName-error" : "firstName-help"
              }
              aria-invalid={errors.firstName ? "true" : "false"}
            />
            <div id="firstName-help" className={styles.helpText}>
              Mínimo 2 caracteres
            </div>
            {errors.firstName && (
              <div
                id="firstName-error"
                className={styles.errorText}
                role="alert"
              >
                {errors.firstName}
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label
              htmlFor="lastName"
              className={`${styles.label} ${styles.required}`}
            >
              Apellidos
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className={styles.input}
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Tus apellidos"
              required
              aria-describedby={
                errors.lastName ? "lastName-error" : "lastName-help"
              }
              aria-invalid={errors.lastName ? "true" : "false"}
            />
            <div id="lastName-help" className={styles.helpText}>
              Mínimo 2 caracteres
            </div>
            {errors.lastName && (
              <div
                id="lastName-error"
                className={styles.errorText}
                role="alert"
              >
                {errors.lastName}
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label
              htmlFor="email"
              className={`${styles.label} ${styles.required}`}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
              aria-describedby={errors.email ? "email-error" : "email-help"}
              aria-invalid={errors.email ? "true" : "false"}
            />
            <div id="email-help" className={styles.helpText}>
              Formato: usuario@dominio.com
            </div>
            {errors.email && (
              <div id="email-error" className={styles.errorText} role="alert">
                {errors.email}
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="phone" className={styles.label}>
              Teléfono (opcional)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={styles.input}
              value={formData.phone}
              onChange={handleChange}
              placeholder="+34 123 456 789"
              aria-describedby={errors.phone ? "phone-error" : "phone-help"}
              aria-invalid={errors.phone ? "true" : "false"}
            />
            <div id="phone-help" className={styles.helpText}>
              Incluye código de país si es internacional
            </div>
            {errors.phone && (
              <div id="phone-error" className={styles.errorText} role="alert">
                {errors.phone}
              </div>
            )}
          </div>
        </fieldset>

        {/* Preferencias Musicales */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Preferencias Musicales</legend>

          <div className={styles.inputGroup}>
            <label htmlFor="favoriteGenre" className={styles.label}>
              Género Musical Favorito
            </label>
            <select
              id="favoriteGenre"
              name="favoriteGenre"
              className={styles.select}
              value={formData.favoriteGenre}
              onChange={handleChange}
              aria-describedby="genre-help"
            >
              <option value="">Selecciona un género</option>
              <option value="rock">Rock</option>
              <option value="pop">Pop</option>
              <option value="jazz">Jazz</option>
              <option value="classical">Clásica</option>
              <option value="electronic">Electrónica</option>
              <option value="reggaeton">Reggaeton</option>
              <option value="indie">Indie</option>
              <option value="folk">Folk</option>
              <option value="other">Otro</option>
            </select>
            <div id="genre-help" className={styles.helpText}>
              Elige tu género musical preferido
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label
              htmlFor="favoriteSong"
              className={`${styles.label} ${styles.required}`}
            >
              Canción Favorita
            </label>
            <input
              id="favoriteSong"
              name="favoriteSong"
              type="text"
              className={styles.input}
              value={formData.favoriteSong}
              onChange={handleChange}
              placeholder="Nombre de tu canción favorita"
              required
              aria-describedby={
                errors.favoriteSong ? "song-error" : "song-help"
              }
              aria-invalid={errors.favoriteSong ? "true" : "false"}
            />
            <div id="song-help" className={styles.helpText}>
              Comparte tu canción favorita actual
            </div>
            {errors.favoriteSong && (
              <div id="song-error" className={styles.errorText} role="alert">
                {errors.favoriteSong}
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="favoriteArtist" className={styles.label}>
              Artista Favorito
            </label>
            <input
              id="favoriteArtist"
              name="favoriteArtist"
              type="text"
              className={styles.input}
              value={formData.favoriteArtist}
              onChange={handleChange}
              placeholder="Nombre de tu artista favorito"
              aria-describedby="artist-help"
            />
            <div id="artist-help" className={styles.helpText}>
              Puede ser solista, banda o grupo
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Experiencia Musical</label>
            <div
              className={styles.radioGroup}
              role="radiogroup"
              aria-label="Experiencia Musical"
            >
              <div className={styles.radioItem}>
                <input
                  id="experience-listener"
                  name="musicExperience"
                  type="radio"
                  value="listener"
                  className={styles.radio}
                  checked={formData.musicExperience === "listener"}
                  onChange={handleChange}
                />
                <label
                  htmlFor="experience-listener"
                  className={styles.radioLabel}
                >
                  Solo escucho música
                </label>
              </div>
              <div className={styles.radioItem}>
                <input
                  id="experience-amateur"
                  name="musicExperience"
                  type="radio"
                  value="amateur"
                  className={styles.radio}
                  checked={formData.musicExperience === "amateur"}
                  onChange={handleChange}
                />
                <label
                  htmlFor="experience-amateur"
                  className={styles.radioLabel}
                >
                  Toco algún instrumento (amateur)
                </label>
              </div>
              <div className={styles.radioItem}>
                <input
                  id="experience-professional"
                  name="musicExperience"
                  type="radio"
                  value="professional"
                  className={styles.radio}
                  checked={formData.musicExperience === "professional"}
                  onChange={handleChange}
                />
                <label
                  htmlFor="experience-professional"
                  className={styles.radioLabel}
                >
                  Soy músico profesional
                </label>
              </div>
            </div>
          </div>
        </fieldset>

        {/* Mensaje */}
        <div className={styles.inputGroup}>
          <label htmlFor="message" className={styles.label}>
            Mensaje Adicional
          </label>
          <textarea
            id="message"
            name="message"
            className={styles.textarea}
            value={formData.message}
            onChange={handleChange}
            placeholder="Cuéntanos más sobre tu relación con la música..."
            rows={4}
            aria-describedby="message-help"
          />
          <div id="message-help" className={styles.helpText}>
            Comparte cualquier cosa adicional sobre tus gustos musicales
          </div>
        </div>

        {/* Checkboxes */}
        <div className={styles.checkboxGroup}>
          <div className={styles.checkboxItem}>
            <input
              id="newsletter"
              name="newsletter"
              type="checkbox"
              className={styles.checkbox}
              checked={formData.newsletter}
              onChange={handleChange}
            />
            <label htmlFor="newsletter" className={styles.checkboxLabel}>
              Quiero recibir recomendaciones musicales por email
            </label>
          </div>

          <div className={styles.checkboxItem}>
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className={styles.checkbox}
              checked={formData.terms}
              onChange={handleChange}
              required
              aria-describedby={errors.terms ? "terms-error" : "terms-help"}
              aria-invalid={errors.terms ? "true" : "false"}
            />
            <label
              htmlFor="terms"
              className={`${styles.checkboxLabel} ${styles.required}`}
            >
              Acepto los términos y condiciones
            </label>
          </div>
          {errors.terms && (
            <div id="terms-error" className={styles.errorText} role="alert">
              {errors.terms}
            </div>
          )}
        </div>

        {/* Botones */}
        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={`${styles.button} ${styles.primaryButton}`}
            aria-describedby="submit-help"
          >
            Enviar Formulario
          </button>
          <button
            type="reset"
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            Limpiar Campos
          </button>
        </div>
        <div id="submit-help" className={styles.helpText}>
          Al enviar, recibirás una confirmación por email
        </div>
      </form>
    </section>
  );
}
