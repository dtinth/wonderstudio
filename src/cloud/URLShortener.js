
const API_KEY = 'AIzaSyBXdSaZqAhTK0cgHSRR8fi0Hua5DBNOBvc'
const cache = { }

// Can’t get whatwg-fetch to work... Gotta go with plain ol XHR.
export async function shorten (longUrl) {
  if (cache[longUrl]) return cache[longUrl]
  const request = JSON.stringify({ longUrl })
  const xhr = new window.XMLHttpRequest()
  xhr.open('POST', 'https://www.googleapis.com/urlshortener/v1/url?key=' + API_KEY, true)
  xhr.setRequestHeader('Content-Type', 'application/json')
  const result = await new Promise((resolve, reject) => {
    xhr.onload = () => resolve(xhr.responseText)
    xhr.onerror = e => reject(e)
    xhr.send(request)
  })
  const data = JSON.parse(result)
  const shortUrl = data.id
  if (!shortUrl) throw new Error('Google did not return a short URL')
  cache[longUrl] = shortUrl
  return shortUrl
}
