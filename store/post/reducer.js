import { success, error } from 'redux-saga-requests';
import {
  GET_ADMIN_POSTS,
  UPDATE_POST
} from './types';

const initialState = {
  posts: [],
  total: 0,
  loading: true,
  syncLoading: false,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ADMIN_POSTS:
    case UPDATE_POST:
      return { ...state, loading: true, error: null };

    case success(GET_ADMIN_POSTS):
      return {
        ...state,
        posts: action.data.data,
        total: action.data.total,
        loading: false
      };

    case success(UPDATE_POST): {
      const postIdx = state.posts.findIndex(item => item.id === action.data.id);
      if(postIdx || postIdx === 0) state.posts[postIdx] = action.data;
      return { ...state, posts: [...state.posts], loading: false };
    }

    case error(GET_ADMIN_POSTS):
    case error(UPDATE_POST):
      return { ...state, loading: false, error: action.error };

    default: return state;
  }
};

export default reducer;
