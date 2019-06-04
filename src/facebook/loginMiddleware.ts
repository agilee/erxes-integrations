import * as graph from 'fbgraph';
import Accounts from '../models/Accounts';
import { graphRequest } from './utils';

const loginMiddleware = (req, res) => {
  const {
    FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET,
    FACEBOOK_PERMISSIONS = 'manage_pages, pages_show_list, pages_messaging',
    DOMAIN,
    MAIN_APP_DOMAIN,
  } = process.env;

  const conf = {
    client_id: FACEBOOK_APP_ID,
    client_secret: FACEBOOK_APP_SECRET,
    scope: FACEBOOK_PERMISSIONS,
    redirect_uri: `${DOMAIN}/fblogin`,
  };

  // we don't have a code yet
  // so we'll redirect to the oauth dialog
  if (!req.query.code) {
    const authUrl = graph.getOauthUrl({
      client_id: conf.client_id,
      redirect_uri: conf.redirect_uri,
      scope: conf.scope,
    });

    if (!req.query.error) {
      // checks whether a user denied the app facebook login/permissions
      res.redirect(authUrl);
    } else {
      res.send('access denied');
    }
  }

  // If this branch executes user is already being redirected back with
  // code (whatever that is)
  // code is set
  // we'll send that and get the access token
  return graph.authorize(
    {
      client_id: conf.client_id,
      redirect_uri: conf.redirect_uri,
      client_secret: conf.client_secret,
      code: req.query.code,
    },
    async (_err, facebookRes) => {
      const { access_token } = facebookRes;

      const userAccount: { id: string; first_name: string; last_name: string } = await graphRequest.get(
        'me?fields=id,first_name,last_name',
        access_token,
      );

      const name = `${userAccount.first_name} ${userAccount.last_name}`;

      const account = await Accounts.findOne({ uid: userAccount.id });

      if (account) {
        await Accounts.updateOne({ _id: account._id }, { $set: { token: access_token } });
      } else {
        await Accounts.create({
          token: access_token,
          name,
          kind: 'facebook',
          uid: userAccount.id,
        });
      }

      return res.redirect(`${MAIN_APP_DOMAIN}/settings/integrations?fbAuthorized=true`);
    },
  );
};

export default loginMiddleware;