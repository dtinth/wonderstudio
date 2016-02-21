
import ObjectID from 'bson-objectid'
import crypto from 'crypto'
import { publishApplication } from '../cloud'
import CompilerBundle from 'bundle!../compiler'
import { browserHistory } from 'react-router'
import DangerousButNecessarySharedMutableState from './DangerousButNecessarySharedMutableState'

const compilerPromise = new Promise(resolve => CompilerBundle(resolve))

async function compile (store) {
  const compiler = await compilerPromise
  return compiler.compile(store.query(studio => studio.getApp()))
}

function generateNewAppKeys () {
  const viewKey = ObjectID.generate()
  const editKey = crypto.randomBytes(12).toString('hex')
  return { viewKey, editKey }
}

export async function runApp (store) {
  const compiledApp = await compile(store)
  store.dispatch(studio => studio.startRunning(compiledApp))
}

export async function share (store) {
  store.dispatch(studio => studio.startPublishing())
  try {
    const compiledApp = await compile(store)
    const newApp = store.query(studio => studio.isNew())
    const options = (newApp
      ? generateNewAppKeys()
      : store.query(studio => studio.getDeployOptions())
    )
    const result = await publishApplication({
      ...options,
      app: compiledApp
    })
    console.log('Application save result:', result)
    if (newApp) {
      DangerousButNecessarySharedMutableState.newAppViewKey = options.viewKey
    }
    browserHistory.push(`/app/${options.viewKey}/studio/${options.editKey}`)
    store.dispatch(studio => studio.finishPublishing({
      viewKey: options.viewKey,
      editKey: options.editKey
    }))
  } catch (e) {
    window.alert('Cannot publish application! Error: ' + e)
    store.dispatch(studio => studio.errorPublishing(e))
  }
}
