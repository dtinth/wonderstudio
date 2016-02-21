
import firebase from './firebase'

export async function publishApplication ({ viewKey, editKey, app }) {
  if (!app.compiled) throw new Error('App is not compiled!')
  await firebase.child('apps').child(viewKey).set(app)
  await firebase.child('editKeys').child(viewKey).set(editKey)
}

export async function canEditApplication ({ viewKey, editKey }) {
  // Hackathon party mode!!!
  return true
}

export async function getApplication ({ viewKey }) {
  const snapshot = await firebase.child('apps').child(viewKey).once('value')
  if (!snapshot.exists()) throw new Error('Application not found.')
  const app = snapshot.val()
  console.log(app)
  if (!app.compiled) throw new Error('Firebase did not return a valid application object.')
  return app
}
