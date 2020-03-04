import { debugGmail, debugNylas, debugSmooch, debugTwitter } from './debuggers';
import { trackGmail } from './gmail/watch';
import { setupNylas } from './nylas/controller';
import { createNylasWebhook } from './nylas/tracker';
import { setupSmoochWebhook } from './smooch/api';
import { setupSmooch } from './smooch/controller';
import * as twitterApi from './twitter/api';
import { getConfig } from './utils';

export const init = async () => {
  const USE_NATIVE_GMAIL = await getConfig('USE_NATIVE_GMAIL');
  const TWITTER_CONSUMER_KEY = await getConfig('TWITTER_CONSUMER_KEY');

  if (USE_NATIVE_GMAIL === 'true') {
    try {
      await trackGmail();
    } catch (e) {
      debugGmail(e.message);
    }
  }

  if (TWITTER_CONSUMER_KEY) {
    try {
      await twitterApi.registerWebhook();
    } catch (e) {
      debugTwitter(e.message);
    }
  }

  try {
    await setupNylas();
    await createNylasWebhook();
  } catch (e) {
    debugNylas(e.message);
  }

  try {
    await setupSmooch();
    await setupSmoochWebhook();
  } catch (e) {
    debugSmooch(`failed to setup smooch: ${e.message}`);
  }
};
