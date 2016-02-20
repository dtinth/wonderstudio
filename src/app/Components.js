
import React from 'react'
import styles from './styles.styl'
import RaisedButton from 'material-ui/lib/raised-button'
import MaterialTextField from 'material-ui/lib/text-field'
import MaterialAppBar from 'material-ui/lib/app-bar'
import u from 'updeep'
import { mapValues } from 'lodash'

const INPUT_PADDING = 16

const propertySet = object => {
  const result = mapValues(object,
    (f, name) => f(createPropertyDescriptionBuilder(name)).build()
  )
  console.log(result)
  return result
}

const createPropertyDescriptionBuilder = name => {
  const createBuilder = descriptor => {
    const update = spec => createBuilder(u(spec)(descriptor))
    return {
      build: () => descriptor,
      coerce: mapper => update({
        set: setter => value => setter(mapper(value))
      }),
      input: (type, options = { }) => update({
        input: { type, ...options }
      })
    }
  }
  return createBuilder({
    get: props => props[name],
    set: value => u({ [name]: () => value }),
    input: null
  })
}

// =============================================================================

export function AppBar (props) {
  return <MaterialAppBar
    title={props.title}
    iconElementLeft={<span />}
  />
}
AppBar.metadata = {
  properties: propertySet({
    title: prop => prop.coerce(String).input('text')
  })
}

// =============================================================================

export function TextField (props) {
  return <MaterialTextField
    style={{ width: '100%' }}
    hintText={props.hintText}
    hintStyle={{ paddingLeft: INPUT_PADDING }}
    floatingLabelText={props.floatingLabelText}
    floatingLabelStyle={{ paddingLeft: INPUT_PADDING }}
    inputStyle={{ paddingLeft: INPUT_PADDING }}
    value={props.value}
  />
}
TextField.metadata = {
  properties: propertySet({
    hintText: prop => prop.coerce(String).input('text'),
    floatingLabelText: prop => prop.coerce(String).input('text'),
    value: prop => prop.coerce(String).input('text')
  })
}

// =============================================================================

export function Button (props) {
  return <div style={{ margin: '8px 16px' }}>
    <RaisedButton
      label={props.label}
      style={{ width: '100%' }}
    />
  </div>
}
Button.metadata = {
  properties: propertySet({
    label: prop => prop.coerce(String).input('text'),
    onclick: prop => prop
  })
}

// =============================================================================

export function Label (props) {
  return <div style={{ margin: '16px 16px', whiteSpace: 'pre-wrap', ...(props.style || { }) }}>
    {props.text}
  </div>
}
Label.metadata = {
  properties: propertySet({
    text: prop => prop.coerce(String).input('textarea', { wide: true })
  })
}

// =============================================================================

export function SectionHeader (props) {
  return <div className={styles.sectionHeader} style={props.style}>
    {props.title}
  </div>
}
SectionHeader.metadata = {
  properties: propertySet({
    title: prop => prop.coerce(String).input('text')
  })
}
