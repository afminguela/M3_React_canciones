import styles from "./Titulo.module.css";

function Titulo() {
  return (
    <section className={styles.container} role="banner">
      <h1 className={styles.title}>Ana</h1>
      <hr className={styles.divider} aria-hidden="true" />
      <h2 className={styles.subtitle}>Fernandez Minguela</h2>
    </section>
  );
}
export default Titulo;
