
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
    const builder = {
      build: () => descriptor,
      doc: text => update({
        doc: text
      }),
      type: type => update({
        type: type
      }),
      string: () => (builder
        .type('string')
        .coerce(String)
        .default('')
      ),
      boolean: () => (builder
        .type('bool')
        .coerce(Boolean)
        .default(false)
      ),
      defaultsToName: () => (builder
        .default(({ name }) => String(name || ''))
      ),
      coerce: mapper => update({
        set: setter => value => setter(mapper(value))
      }),
      input: (type, options = { }) => update({
        input: { type, ...options }
      }),
      default: valueOrFunction => update({
        default: () => (typeof valueOrFunction === 'function'
          ? valueOrFunction
          : () => valueOrFunction
        )
      }),
      set: newSetter => update({ set: () => newSetter }),
      get: newGetter => update({ get: () => newGetter })
    }
    return builder
  }
  return createBuilder({
    get: props => props[name],
    set: value => u({ [name]: () => value }),
    input: null,
    default: () => null
  })
}

// =============================================================================

export function AppBar (props) {
  return <MaterialAppBar
    title={props.title}
    style={{ marginBottom: 8 }}
    iconElementLeft={<span />}
  />
}
AppBar.metadata = {
  properties: propertySet({
    title: prop => (prop
      .string()
      .defaultsToName()
      .doc('Application title')
      .input('text')
    )
  })
}

// =============================================================================

export function Button (props) {
  return <div style={{ margin: '8px 16px' }}>
    <RaisedButton
      label={props.label}
      style={{ width: '100%' }}
      onClick={props.onclick}
      primary={props.primary}
      secondary={props.secondary}
    />
  </div>
}
Button.metadata = {
  properties: propertySet({
    label: prop => (prop
      .string()
      .defaultsToName()
      .doc('The text to display on the button')
      .input('text')
    ),
    primary: prop => (prop
      .set(value => u({
        primary: value,
        secondary: x => x && !value
      }))
      .boolean()
      .doc('If true, this button will have a very attractive style')
      .input('checkbox')
    ),
    secondary: prop => (prop
      .set(value => u({
        primary: x => x && !value,
        secondary: value
      }))
      .boolean()
      .doc('If true, this button will have a secondary style')
      .input('checkbox')
    ),
    onclick: prop => (prop
      .type('fn()')
      .doc('The function that will be invoked when the button is clicked')
    )
  })
}

// =============================================================================

export function Label (props) {
  return <div style={{
    margin: '8px 16px',
    whiteSpace: 'pre-wrap',
    fontWeight: props.bold ? 'bold' : 'normal'
  }}>
    {props.text}
  </div>
}
Label.metadata = {
  properties: propertySet({
    text: prop => (prop
      .string()
      .defaultsToName()
      .doc('The label’s text')
      .input('textarea', { wide: true })
    ),
    bold: prop => (prop
      .boolean()
      .doc('Whether or not to display text in bold')
      .input('checkbox')
    )
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
    title: prop => (prop
      .string()
      .defaultsToName()
      .doc('The section title text')
      .input('text')
    )
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
    onChange={e => {
      const value = e.target.value
      props.onPropChange('value', value)
      if (props.onchange) props.onchange(e)
    }}
    {...props.multiline ? { multiLine: true, rows: 3, rowsMax: 5 } : { }}
  />
}
TextField.metadata = {
  properties: propertySet({
    hintText: prop => (prop
      .string()
      .doc('The placeholder text that will be displayed when this field is empty')
      .input('text')
    ),
    floatingLabelText: prop => (prop
      .string()
      .defaultsToName()
      .doc('The text to display above the field’s value')
      .input('text')
    ),
    value: prop => (prop
      .string()
      .doc('The text inside this text field')
      .input('textarea')
    ),
    multiline: prop => (prop
      .boolean()
      .doc('If true, will allow user to enter multiple lines of text')
      .input('checkbox')
    )
  })
}
