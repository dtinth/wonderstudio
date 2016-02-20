import React from 'react'
import styles from './ComponentEditor.styl'
import classNames from 'classnames'

const SectionTitle = (props) => <div className={styles.sectionTitle}>
  {props.children}
</div>

const FieldGroup = (props) => <div
  className={classNames(styles.fieldGroup, {
    [styles.withTitle]: props.title
  })}
>
  {props.title ? <div className={styles.fieldGroupTitle}>{props.title}</div> : null}
  {props.children}
</div>

export default React.createClass({
  propTypes: {
    component: React.PropTypes.object
  },
  render () {
    const component = this.props.component
    return <div className={styles.root}>
      <div className={styles.type}>{component.type}</div>

      <SectionTitle>Name</SectionTitle>
      <FieldGroup>
        <input className={styles.input} placeholder='Control name' value={component.name} />
      </FieldGroup>

      <SectionTitle>Properties</SectionTitle>
      <FieldGroup title='label'>
        <input className={styles.input} placeholder='Text to display' />
      </FieldGroup>
    </div>
  }
})
