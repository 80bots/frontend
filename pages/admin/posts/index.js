import React from 'react';
import Posts from 'components/Posts/Admin';
import AppLayout from 'components/default/layout';

const PostsPage = () => <AppLayout title={'Posts'} hideBanner> <Posts /> </AppLayout>;

export default PostsPage;