
export function publishApplication ({ viewKey, /* editKey, */ app }) {
  return Promise.reject(new Error('UNIMPLEMENTED'))
}

export function canEditApplication ({ /* viewKey, editKey */ }) {
  // Hackathon party mode!!!
  return Promise.resolve(true)
}

export function getApplication ({ viewKey }) {
  return Promise.reject(new Error('UNIMPLEMENTED'))
}
