import styles from "./aficiones.module.css";

function Aficiones() {
  const aficiones = [
    "Escuchar música",
    "Ver series",
    "Echar las horas muertas con el ordenador",
  ];

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Mis Aficiones</h2>
      <ul className={styles.list} role="list">
        {aficiones.map((aficion, index) => (
          <li
            key={index}
            className={styles.listItem}
            tabIndex={0}
            role="listitem"
          >
            <span className={styles.itemText}>{aficion}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
export default Aficiones;
