
import React from 'react'

export default React.createClass({
  propTypes: {
    activity: React.PropTypes.string
  },
  render () {
    return <div>
      <div className='WonderstudioLoading'>
        <div className='appname'>
          <em>wonderful.software</em><span>/</span><strong>studio</strong>
        </div>
        <div className='appdesc'>
          is {this.props.activity}
        </div>
      </div>
    </div>
  }
})
