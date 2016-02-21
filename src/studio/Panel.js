import React from 'react'
import styles from './Panel.styl'

export default ({ title, children }) => (
  <div className={styles.root}>
    <div className={styles.title}>{title}</div>
    {children}
  </div>
)

export const SectionTitle = (props) => <div className={styles.sectionTitle}>
  {props.children}
</div>
