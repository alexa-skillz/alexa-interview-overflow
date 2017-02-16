'use strict';

module.exports = {
  twitterAuth: {
    consumerKey: 'dOSZXiNt22afKx8qEK8l6ysrU',
    consumerSecret: 'uMr6zLLO0VXzCPJSkbiVq5mH68Aj7oskAQyzglCI3Z0wmn2yTb',
    callbackURL: `${__API_URL__}/auth/twitter/callback`,
  },
  googleAuth: {
    clientID: '40065981989-g9g2katjl028obp28pgajvdkbgift6cb.apps.googleusercontent.com',
    clientSecret: '90Cw2h2B2W_UMVLwiJ7mBp1Y',
    callbackURL: `${__API_URL__}/auth/google/callback`,
  },
};
