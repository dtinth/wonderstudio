
import Firebase from 'firebase'
import { once } from 'lodash'

export default once(() => new Firebase('https://ss16-wonderstudio.firebaseio.com/wonderstudio'))
