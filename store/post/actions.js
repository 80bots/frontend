import { success } from 'redux-saga-requests';

import {
  GET_ADMIN_POSTS,
  ADD_POST,
  UPDATE_POST,
  DELETE_POST
} from './types';

export const adminGetPosts = (query = { page: 1, limit: 1 }) => {
  Object.keys(query).forEach((key) => (query[key] === '') && delete query[key]);
  return {
    type: GET_ADMIN_POSTS,
    request: {
      method: 'GET',
      url: '/admin/posts',
      params: query
    },
    meta: {
      thunk: true
    }
  };
};

export const addPost = (data) => ({
  type: ADD_POST,
  request: {
    method: 'POST',
    url: '/admin/posts',
    data
  },
  meta: {
    thunk: true,
    admin: true
  }
});

export const updatePost = (id, updateData) => {
  return {
    type: UPDATE_POST,
    request: {
      method: 'PUT',
      url: `/admin/posts/${id}`,
      data: { update: updateData }
    },
    meta: {
      thunk: true,
      admin: true
    }
  };
};

export const deletePost = (id) => ({
  type: DELETE_POST,
  request: {
    method: 'DELETE',
    url: `/admin/posts/${id}`
  },
  meta: {
    thunk: true,
    admin: true
  }
});