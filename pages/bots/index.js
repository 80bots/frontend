import React from 'react';
import Bots from '/components/Bots';
import AppLayout from '/components/default/layout';

const BotsPage = () => <AppLayout title={'Available Bots'} hideBanner> <Bots /> </AppLayout>;

export default BotsPage;
