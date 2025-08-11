jest.mock('../../config/env', () => ({
  env: {
    COGNITO_CLIENT_ID: 'mockClientId',
    COGNITO_USER_POOL_ID: 'mockUserPoolId',
    TABLE_NAME: 'mockTable',
  },
}));
