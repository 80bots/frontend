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

const Container = styled(Card)` 
  border-radius: .25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
`;

const Header = styled(CardHeader)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Back = styled(Button)`
  padding: 0 5px;
  margin-right: 10px;
`;

const A = styled.a`
  color: inherit;
  text-decoration: none;
`;

const ViewPost = ({ theme }) => {

  return(
    <>
      <Container>
        <Header id={'back-portal'}>
          {
            <Back type={'primary'}>
              <Link href={'/admin/posts'}><A>Back</A></Link>
            </Back>
          }
        </Header>
        <CardBody>
          View Post
        </CardBody>
      </Container>

    </>
  );

};

ViewPost.propTypes = {
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired
  }).isRequired
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ViewPost));
