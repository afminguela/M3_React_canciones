import styles from "./aficiones.module.css";


function Aficiones() {
    return (
        <>
            <ul>
                <li className={styles.li}>Escuchar música</li>
                <li className={styles.li}>Ver series</li>
                <li className={styles.li}>Echar las horas muertas con el ordenador</li>
            </ul>
        </>
    )
}
export default Aficiones;