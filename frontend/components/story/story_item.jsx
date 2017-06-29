import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { DragSource, DropTarget } from 'react-dnd';
import { selectUser } from '../../util/selectors';
import * as StoryUtil from './story_util';
import { updateStory, prioritizeStory } from '../../actions/story_actions';
import StoryForm from './story_form';

const workflow = {
  unstarted: { started: 'Start'},
  started: { finished: 'Finish'},
  finished: { delivered: 'Deliver'},
  delivered: { accepted: 'Accept', rejected: 'Reject'},
  rejected: { started: 'Restart'},
};

class StoryItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = { open: StoryUtil.isNew(this.props.story) }
    this.handleCaret = this.handleCaret.bind(this);
    this.handleAction = this.handleAction.bind(this);
  }

  render() {
    return this.state.open
      ? <StoryForm story={this.props.story} handleClose={this.handleCaret}/>
      : this.renderItem();
  }

  renderItem() {
    const { story, canDrag } = this.props;
    const { connectDragSource, isDragging } = this.props;
    const { connectDropTarget, isOver } = this.props;

    const className =`story-item ${story.state}`
      + (isDragging ? ' drag-source' : '')
      + (isOver ? ' drop-target' : '')
      + (canDrag(story) ? ' can-drag' : '');

    return connectDropTarget(connectDragSource(
      <div className={className}>
        <div>
          {this.renderCaret()}
          {this.renderKind()}
          {this.renderTitle()}
        </div>
        <div className='action'>
          {this.renderActions()}
        </div>
      </div>
    ));
  }

  renderCaret() {
    const icon = `fa fa-caret-${this.state.open ? 'down' : 'right'}`
    return <i className={`caret ${icon}`} onClick={this.handleCaret} />
  }

  renderKind() {
    return StoryUtil.renderKind(this.props.story.kind);
  }

  renderTitle() {
    const { story, initials } = this.props;
    return (
      <div>
        <span className='title'>
          {story.title}
        </span> (<span className='initials'>{initials}</span>)
      </div>
    );
  }

  renderActions() {
    const actions = workflow[this.props.story.state];
    const buttons = actions && Object.keys(actions).map(action => {
      const title = actions[action];
      return (
        <button
          key={action}
          type='button'
          className={action.replace(/ed$/, '')}
          onClick={this.handleAction(action)}>
          {title}
        </button>
      );
    });
    return buttons;
  }

  handleCaret(e) {
    this.setState(prevState => ({ open: !prevState.open }));
  }

  handleAction(action) {
    return (e) => {
      const story = Object.assign({}, this.props.story, { state: action });
      this.props.commit(story);
    }
  }
}

//  drag & drop

const storySource = {
  canDrag: ({ story, canDrag }) => canDrag(story),
  beginDrag: ({ story }) => ({ sourceId: story.id }),
  endDrag(props, monitor) {
    if (monitor.didDrop()) {
      const story = monitor.getDropResult();
      if (story) {
        const old_priority = parseInt(props.story.priority);
        let new_priority = parseInt(story.priority);
        if (old_priority !== new_priority) {
          props.prioritize(props.story, new_priority);
        }
      }
    }
  }
}

const storyTarget = {
  drop: ({ story }) => story
}

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

const collectTarget = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
});

const dragSource = DragSource(
  StoryUtil.DragDropItemTypes.STORY,
  storySource,
  collectSource
)(StoryItem);

const dragSourceAndDropTarget = DropTarget(
  StoryUtil.DragDropItemTypes.STORY,
  storyTarget,
  collectTarget
)(dragSource);

const mapStateToProps = (state, {story}) => ({
  initials: selectUser(state, story.author_id)['initials']
});

const mapDispatchToProps = dispatch => ({
  commit: story => dispatch(updateStory(story)),
  prioritize: (story, priority) => dispatch(prioritizeStory(story, priority))
})

const connectedDragSourceAndDropTarget = connect(
  mapStateToProps,
  mapDispatchToProps
)(dragSourceAndDropTarget);

export default connectedDragSourceAndDropTarget;
