import React from 'react'
import ReactDOM from 'react-dom'
import styles from './AppPreview.styl'
import Widget from '../app/Widget'
import WidgetGroup from '../app/WidgetGroup'
import { DragSource, DropTarget } from 'react-dnd'
import { compose, pure, withState } from 'recompose'
import classNames from 'classnames'
import ComponentEditor from './ComponentEditor'

const DraggableWidget = compose(
  DragSource('widget',
    {
      beginDrag (props) {
        return {
          component: props.component,
          setDropTarget: props.onSetDropTarget
        }
      },
      endDrag (props, monitor) {
        props.onDragEnd(monitor)
      }
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    })
  ),
  pure
)(({ component, connectDragSource, isDragging, onClick }) => {
  const className = classNames(styles.draggableWidget, isDragging && styles.isDragging)
  return connectDragSource(
    <div className={className} onClick={onClick}>
      <div className={styles.widget}>
        <Widget component={component} />
      </div>
      <div className={styles.widgetOverlay}></div>
    </div>
  )
})

function getDropTarget (groups, pointer) {
  for (const group of Array.from(groups)) {
    const rect = group.getBoundingClientRect()
    const index = +group.getAttribute('data-index')
    if (pointer.y >= rect.top && pointer.y <= rect.bottom) {
      if (pointer.y <= rect.top + rect.height / 2) {
        return index
      } else {
        return index + 1
      }
    }
  }
}

function calculateTop (contentWrapper, index) {
  return (() => {
    {
      const el = contentWrapper.querySelector('.js-group[data-index="' + index + '"]')
      if (el) return el.getBoundingClientRect().top
    }
    {
      const el = contentWrapper.querySelector('.js-group[data-index="' + (index - 1) + '"]')
      if (el) return el.getBoundingClientRect().bottom
    }
  })() - contentWrapper.getBoundingClientRect().top
}

const AppPreview = compose(
  DropTarget('widget',
    {
      hover (props, monitor, component) {
        const item = monitor.getItem()
        const dom = ReactDOM.findDOMNode(component)
        const groups = dom.querySelectorAll('.js-group')
        const pointer = monitor.getClientOffset()
        const dropTarget = getDropTarget(groups, pointer)
        item.setDropTarget(dropTarget)
      }
    },
    (connect, monitor) => ({
      connectDropTarget: connect.dropTarget(),
      target: (item => item && item.target)(monitor.getItem())
    })
  ),
  withState('dropTarget', 'onSetDropTarget', null),
  pure
)(React.createClass({
  propTypes: {
    state: React.PropTypes.object,
    connectDropTarget: React.PropTypes.func,
    dropTarget: React.PropTypes.any,
    onSetDropTarget: React.PropTypes.func,
    dispatch: React.PropTypes.func,
    query: React.PropTypes.func
  },
  getInitialState () {
    return { }
  },
  componentDidUpdate () {
    if (typeof this.props.dropTarget === 'number') {
      const top = calculateTop(this._contentWrapper, this.props.dropTarget)
      this._dropHint.style.top = top + 'px'
    }
  },
  onDragEnd (monitor) {
    const sourceComponent = monitor.getItem().component
    const targetPosition = this.props.dropTarget
    this.props.onSetDropTarget(null)
    if (typeof targetPosition === 'number') {
      this.props.dispatch(app => app.moveComponent(sourceComponent, targetPosition))
    }
  },
  renderWidget (component, index) {
    return <DraggableWidget
      component={component}
      key={index}
      onSetDropTarget={this.props.onSetDropTarget}
      onDragEnd={this.onDragEnd}
      onClick={() => this.props.dispatch(app => app.selectComponent(component))}
    />
  },
  renderGroup (group, index) {
    const componentNames = group.components.map(component => component.name).join(', ')
    return <div className={classNames(styles.group, 'js-group')} data-index={index} key={index}>
      <div className={styles.groupLabel}>
        {componentNames}
      </div>
      <div className={styles.groupContent}>
        <WidgetGroup>
          {group.components.map(this.renderWidget)}
        </WidgetGroup>
      </div>
    </div>
  },
  renderComponentEditor () {
    const selectedComponent = this.props.query(app => app.getSelectedComponent())
    if (!selectedComponent) return null
    return <div className={styles.componentEditor}>
      <ComponentEditor component={selectedComponent} />
    </div>
  },
  render () {
    return this.props.connectDropTarget(<div>
      <div className={styles.container}>
        <div className={styles.content} ref={el => this._contentWrapper = el}>
          <div className={styles.backdrop}></div>
          {this.props.state.app.ui.map(this.renderGroup)}
          <div className={styles.group}>
            <div className={styles.groupContent}>
              <div className={styles.newControl}>
                <button>add a new control</button>
              </div>
            </div>
          </div>
          <div
            className={classNames(styles.dropHint, {
              [styles.isHorizontal]: typeof this.props.dropTarget === 'number'
            })}
            ref={el => this._dropHint = el}
          ></div>
        </div>
      </div>
      {this.renderComponentEditor()}
    </div>)
  }
}))

export default AppPreview
