
import React from 'react'
import styles from './styles.styl'
import RaisedButton from 'material-ui/lib/raised-button'
import MaterialTextField from 'material-ui/lib/text-field'
import MaterialAppBar from 'material-ui/lib/app-bar'
import u from 'updeep'

const INPUT_PADDING = 16

export function AppBar (props) {
  return <MaterialAppBar
    title={props.title}
    iconElementLeft={<span />}
  />
}

export function TextField (props) {
  return <MaterialTextField
    style={{ width: '100%' }}
    hintText={props.hintText}
    hintStyle={{ paddingLeft: INPUT_PADDING }}
    floatingLabelStyle={{ paddingLeft: INPUT_PADDING }}
    inputStyle={{ paddingLeft: INPUT_PADDING }}
    defaultValue={props.value}
    floatingLabelText={props.floatingLabelText}
  />
}

export function Button (props) {
  return <div style={{ margin: '8px 16px' }}>
    <RaisedButton
      label={props.label}
      style={{ width: '100%' }}
    />
  </div>
}

const property = (name, coerce = x => x) => ({
  get: props => props[name],
  set: value => u({ [name]: () => coerce(value) })
})

Button.metadata = {
  properties: {
    label: property('label', String),
    onclick: property('onclick')
  }
}

export function Label (props) {
  return <div style={{ margin: '16px 16px', whiteSpace: 'pre-wrap', ...(props.style || { }) }}>
    {props.text}
  </div>
}

export function SectionHeader (props) {
  return <div className={styles.sectionHeader} style={props.style}>
    {props.title}
  </div>
}
