import { RECEIVE_STORY, RECEIVE_DELETE_STORY } from '../actions/story_actions';
import { RECEIVE_PROJECT } from '../actions/project_actions';
import { RECEIVE_TASK, RECEIVE_DELETE_TASK } from '../actions/task_actions';
import * as _ from 'lodash';

const defaultState = {}

const StoriesReducer = (state = defaultState, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_PROJECT:
      return action.stories || defaultState;

    case RECEIVE_STORY: {
      let newState = Object.assign({}, state);
      newState[action.story.id] = action.story;
      return newState;
    }

    case RECEIVE_DELETE_STORY: {
      let newState = Object.assign({}, state);
      delete newState[action.story.id];
      return newState;
    }

    case RECEIVE_TASK: {
      const { task } = action;
      let newState = _.merge({}, state);
      const story = newState[task.story_id];
      if (story) {
        story.tasks[task.id] = task;
      }
      return newState;
    }

    case RECEIVE_DELETE_TASK: {
      const { task } = action;
      let newState = _.merge({}, state);
      const story = newState[task.story_id];
      if (story) {
        delete story.tasks[task.id];
      }
      return newState;
    }

    default:
      return state;
  }
};

export default StoriesReducer;
