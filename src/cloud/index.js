
import getFirebase from './firebase'

export async function publishApplication ({ viewKey, editKey, app }) {
  if (!app.compiled) throw new Error('App is not compiled!')
  const firebase = getFirebase()
  await firebase.child('apps').child(viewKey).set(app)
  await firebase.child('editKeys').child(viewKey).set(editKey)
}

export async function canEditApplication ({ viewKey, editKey }) {
  // Hackathon party mode!!!
  return true
}

// Download using REST API so that ServiceWorker can easily cache it
function getUsingAjax ({ viewKey }) {
  return new Promise((resolve, reject) => {
    const url = ('https://ss16-wonderstudio.firebaseio.com/wonderstudio/apps/' +
      viewKey + '.json'
    )
    const xhr = new window.XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onload = () => resolve(xhr.responseText)
    xhr.onerror = e => reject(e)
    xhr.send(null)
  }).then(responseText => JSON.parse(responseText))
}

// If for some reason it doesn’t work...
async function getUsingFirebaseApi ({ viewKey }) {
  const firebase = getFirebase()
  const snapshot = await firebase.child('apps').child(viewKey).once('value')
  if (!snapshot.exists()) throw new Error('Application not found.')
  const app = snapshot.val()
  return app
}

export async function getApplication ({ viewKey }) {
  const promise = getUsingAjax({ viewKey }).catch(e => {
    console.error('Cannot fetch using Firebase REST; fallback to Firebase API', e)
    return getUsingFirebaseApi({ viewKey })
  })
  const app = await promise
  console.log(app)
  if (!app.compiled) throw new Error('Firebase did not return a valid application object.')
  return app
}
