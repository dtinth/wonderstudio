import React from 'react'
import styles from './ComponentEditor.styl'
import classNames from 'classnames'
import * as Components from '../app/Components'
import { pure } from 'recompose'
import Panel, { SectionTitle } from './Panel'
import Icon from 'react-fa'

const FieldGroup = (props) => <div
  className={classNames(styles.fieldGroup, {
    [styles.withTitle]: props.title,
    [styles.isWide]: props.wide
  })}
>
  {props.title ? <div className={styles.fieldGroupTitle}>{props.title}</div> : null}
  {props.children}
</div>

const InputTypes = { }

InputTypes['text'] = pure(({ value, onChange, descriptor }) => (
  <input
    className={styles.input}
    placeholder={descriptor.input.placeholder}
    value={value}
    onChange={e => { onChange(e.target.value) }}
  />
))

InputTypes['textarea'] = pure(({ value, onChange, descriptor }) => (
  <textarea
    className={styles.textarea}
    placeholder={descriptor.input.placeholder}
    value={value}
    onChange={e => { onChange(e.target.value) }}
  />
))

InputTypes['checkbox'] = pure(({ value, onChange, descriptor }) => (
  <div className={styles.checkbox}>
    <input
      type='checkbox'
      className={styles.checkboxInput}
      checked={value}
      onChange={e => { onChange(e.target.checked) }}
    />
    <Icon name='check' className={styles.checkmark} />
  </div>
))

export default pure(React.createClass({
  propTypes: {
    component: React.PropTypes.object,
    dispatchToApp: React.PropTypes.func
  },
  renderProperties () {
    const component = this.props.component
    const propertyDescriptors = Components[component.type].metadata.properties
    return Object.keys(propertyDescriptors).map(propertyName => {
      const descriptor = propertyDescriptors[propertyName]
      const input = descriptor.input
      if (!input) return null
      const Input = InputTypes[input.type]
      return <FieldGroup title={propertyName} wide={input.wide}>
        <Input
          descriptor={descriptor}
          onChange={newValue => {
            this.props.dispatchToApp(app =>
              app.setComponentProperty(component, propertyName, newValue)
            )
          }}
          value={descriptor.get(component.props)}
        />
      </FieldGroup>
    })
  },
  render () {
    const component = this.props.component
    return <Panel title={component.type}>
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
    </Panel>
  }
}))
