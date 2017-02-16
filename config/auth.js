'use strict';

module.exports = {
  twitterAuth: {
    consumerKey: 'dOSZXiNt22afKx8qEK8l6ysrU',
    consumerSecret: 'uMr6zLLO0VXzCPJSkbiVq5mH68Aj7oskAQyzglCI3Z0wmn2yTb',
    callbackURL: 'http://127.0.0.1:8000/auth/twitter/callback',
  },
  googleAuth: {
    clientID: '40065981989-g9g2katjl028obp28pgajvdkbgift6cb.apps.googleusercontent.com',
    clientSecret: '90Cw2h2B2W_UMVLwiJ7mBp1Y',
    callbackURL: 'http://127.0.0.1:8000/auth/google/callback',
  },
  amazonAuth: {
    clientID: 'amzn1.application-oa2-client.dded369da06942478a1d2daad3fff818',
    clientSecret: '84f2d2f428479951a0a1ac946b2e9a8fd9933a10906e7f746d16472b236cd368',
    callbackURL: 'http://127.0.0.1:8000/auth/amazon/callback',
  },
};
