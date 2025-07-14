import styles from "./loader.module.css"

const Loader = ({ style }) => {
  return (
    <div className={styles.loading}>
      <div style={style}></div>
      <h6 style={{ color: 'white'}}>Please wait</h6>
    </div>
  )
}

export default Loader