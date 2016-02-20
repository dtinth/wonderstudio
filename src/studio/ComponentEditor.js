import React from 'react'
import styles from './ComponentEditor.styl'
import classNames from 'classnames'
import * as Components from '../app/Components'

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
    component: React.PropTypes.object,
    dispatchToApp: React.PropTypes.func
  },
  renderProperties () {
    const component = this.props.component
    const propertyDescriptors = Components[component.type].metadata.properties
    return Object.keys(propertyDescriptors).map(propertyName => {
      // const descriptor = propertyDescriptors[propertyName]
      return <FieldGroup title={propertyName}>
        <input className={styles.input} placeholder='Text to display' value={component.props[propertyName]} />
      </FieldGroup>
    })
  },
  render () {
    const component = this.props.component
    return <div className={styles.root}>
      <div className={styles.type}>{component.type}</div>

      <SectionTitle>Name</SectionTitle>
      <FieldGroup>
        <input
          className={styles.input}
          placeholder='Control name'
          value={component.name}
          onChange={e => {
            const name = e.target.value
            this.props.dispatchToApp(app => app.renameComponent(component, name))
          }}
        />
      </FieldGroup>

      <SectionTitle>Properties</SectionTitle>
      {this.renderProperties()}
    </div>
  }
})
