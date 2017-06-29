import React from 'react'

const workflow = {
  unstarted: { started: 'Start'},
  started: { finished: 'Finish'},
  finished: { delivered: 'Deliver'},
  delivered: { accepted: 'Accept', rejected: 'Reject'},
  rejected: { started: 'Restart'},
};

const StoryWorkflowActions = ({ story, handleAction }) => {
  const actions = workflow[story.state];
  const buttons = actions && Object.keys(actions).map(action => {
    const title = actions[action];
    return (
      <button
        key={action}
        type='button'
        className={action.replace(/ed$/, '')}
        onClick={handleAction(action)}>
        {title}
      </button>
    );
  });
  return (
    <div className='story-workflow-actions'>
      {buttons}
    </div>
  );
}

export default StoryWorkflowActions;
