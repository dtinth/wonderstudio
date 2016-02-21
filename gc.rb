#!/usr/bin/env ruby

path = ARGV[0]
name = File.basename(path)

component = <<END
import React from 'react'
import styles from './#{name}.styl'

export default React.createClass({
  render () {
    return <div className={styles.root}>
    </div>
  }
})
END

style = <<END
.root
  display block
END

File.write("#{path}.js", component)
File.write("#{path}.styl", style)
