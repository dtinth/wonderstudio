
import React from 'react'

export function reproxy (proxy, FallbackComponent) {
  return React.createClass({
    mixins: [ proxy.Mixin ],
    renderUnavailable () {
      return <FallbackComponent {...this.props} />
    }
  })
}

export default reproxy
