import React, {useEffect, useState, useRef} from 'react';
import PropTypes from 'prop-types';
import {Card, CardBody, CardHeader} from '../../default/Card';
import {connect} from 'react-redux';
import { withTheme } from 'emotion-theming';
import { Filters, LimitFilter, ListFilter, SearchFilter, Table, Thead } from '../../default/Table';
import { Button, Loader, Paginator } from '../../default';
import styled from '@emotion/styled';
import {useRouter} from 'next/router';
import Link from 'next/link';
import { adminGetPosts, addPost, updatePost, deletePost } from 'store/post/actions';
import { addNotification } from 'store/notification/actions';
import Modal from '../../default/Modal';
import {css} from '@emotion/core';
import {NOTIFICATION_TYPES} from '../../../config';
import PostEditor from './components/PostEditor';
import Icon from '../../default/icons';

const AddButtonWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
  button {
    margin-right: 20px;
    &:last-child {
      margin-right: 0;
    }
  }
`;

const Container = styled(Card)` 
  border-radius: .25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const IconButton = styled(Button)`
  display: inline-flex;
  justify-content: center; 
  padding: 2px;
  margin-right: 5px;
  width: 27px;
  height: 27px;
  &:last-child {
    margin-right: 0;
  }
`;

const modalContainerStyles = css`
  margin-top: 0;
`;

const modalStyles = css`
  min-width: 800px;
  max-width: 800px;
  overflow-y: visible;
  @media (max-height: 900px) {
    max-height: 700px;
    overflow-y: scroll;
  }
`;

const A = styled.a`
  color: inherit;
  text-decoration: none;
`;

const Posts = ({ addNotification, adminGetPosts, updatePost, deletePost, posts, total, theme, ...props }) => {

  const [clickedPost, setClickedPost] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const addModal = useRef(null);
  const editModal = useRef(null);
  const deleteModal = useRef(null);

  useEffect(() => {
    adminGetPosts({ page, limit });
  }, []);

  const convertPostData = postData => ({
    title: postData.title,
    content: postData.content
  });

  const submitAddPost = postData => {
    props.addPost(convertPostData(postData))
      .then(() => {
        addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: 'Post added!' });
        addModal.current.close();
        adminGetPosts({ page, limit });
      })
      .catch(() => addNotification({ type: NOTIFICATION_TYPES.ERROR, message: 'Add failed!' }));
  };

  const submitUpdatePost = postData => {
    updatePost(clickedPost.id, convertPostData(postData))
      .then(() => {
        addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: 'Post updated!' });
        editModal.current.close();
      })
      .catch(() => addNotification({ type: NOTIFICATION_TYPES.ERROR, message: 'Update failed!' }));
  };

  const submitDeletePost = () => {
    setClickedPost(null);
    deletePost(clickedPost.id)
      .then(() => {
        addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: 'Post removed!' });
        adminGetPosts({ page, limit });
        deleteModal.current.close();
      })
      .catch(() => addNotification({ type: NOTIFICATION_TYPES.ERROR, message: 'Post delete failed' }));
  };

  const renderRow = (post, idx) => <tr key={idx}>
    <td>{ post.title }</td>
    <td>{ post.content }</td>
    <td>{ post.status }</td>
    <td>
      <Buttons>
        <IconButton title={'View Post'} type={'primary'}>
          <Link href={'/admin/posts/[id]/view'} as={`/admin/posts/${post.id}/view`}>
            <A><Icon name={'eye'} color={theme.colors.white}/></A>
          </Link>
        </IconButton>

        <IconButton title={'Edit Post'} type={'primary'} onClick={() => { setClickedPost(post); editModal.current.open(); }}>
          <Icon name={'edit'} color={theme.colors.white}/>
        </IconButton>
        <IconButton title={'Delete Post'} type={'danger'}
          onClick={() => { setClickedPost(post); deleteModal.current.open(); }}
        >
          <Icon name={'garbage'} color={theme.colors.white}/>
        </IconButton>
      </Buttons>
    </td>
  </tr>;

  return(
    <>
      <AddButtonWrap>
        <Button type={'success'} onClick={() => addModal.current.open()}>Add Post</Button>
      </AddButtonWrap>
      <Container>
        <CardBody>
          <Filters>
            <LimitFilter onChange={({ value }) => {setLimit(value); adminGetPosts({ page, limit: value }); }}/>
            <SearchFilter onChange={console.log}/>
          </Filters>
          <Table responsive>
            <Thead>
              <tr>
                <th>Title</th>
                <th>Content</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </Thead>
            <tbody>
              { posts.map(renderRow) }
            </tbody>
          </Table>
          <Paginator total={total} pageSize={limit} onChangePage={(page) => { setPage(page); adminGetPosts({ page, limit }); }}/>
        </CardBody>
      </Container>

      <Modal ref={addModal} title={'Add Post'} contentStyles={modalStyles} containerStyles={modalContainerStyles}
        disableSideClosing
      >
        <PostEditor type={'add'} onSubmit={submitAddPost} onClose={() => addModal.current.close()} />
      </Modal>

      <Modal ref={editModal} title={'Edit Post'} contentStyles={modalStyles} containerStyles={modalContainerStyles}>
        <PostEditor type={'edit'} post={clickedPost} onSubmit={submitUpdatePost} onClose={() => editModal.current.close()} />
      </Modal>

      <Modal ref={deleteModal} title={'Delete Post'} contentStyles={css`min-width: 300px;`}>
        <Buttons>
          <Button type={'primary'} onClick={submitDeletePost}>
            Yes
          </Button>
          <Button type={'danger'} onClick={() => { setClickedPost(null); deleteModal.current.close(); }}>
            Cancel
          </Button>
        </Buttons>
      </Modal>

    </>
  );

};

Posts.propTypes = {
  addNotification: PropTypes.func.isRequired,
  adminGetPosts: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  posts: state.post.posts,
  total: state.post.total,
});

const mapDispatchToProps = dispatch => ({
  addNotification: payload => dispatch(addNotification(payload)),
  adminGetPosts: query => dispatch(adminGetPosts(query)),
  addPost: (data) => dispatch(addPost(data)),
  updatePost: (id, data) => dispatch(updatePost(id, data)),
  deletePost: id => dispatch(deletePost(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Posts));
