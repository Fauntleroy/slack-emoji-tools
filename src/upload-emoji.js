import _ from 'lodash';
import superagent from 'superagent';
import SuperagentThrottle from 'superagent-throttle';
import uuid from 'uuid';

import getSlackApiData from './get-slack-api-data';

const NO_OP = function () {};

/**
 * Throttle requests to no more than 15 per minute to avoid hitting Slack API's
 * rate limit.
 *
 * @see [Slack API rate limit docs](https://api.slack.com/docs/rate-limits#web)
 */
const superagentThrottle = new SuperagentThrottle({
  active: true,
  concurrent: 5,
  rate: 15,
  ratePer: 60000,
});

export default function uploadEmoji (file, callback = NO_OP) {
  const { apiToken, versionUid } = getSlackApiData();
  const timestamp = Date.now() / 1000;  
  const version = versionUid ? versionUid.substring(0, 8) : 'noversion';
  const id = uuid.v4();
  const name = file.name.split('.')[0];
  const imageUploadRequest = superagent.post('/api/emoji.add')
    .withCredentials()
    .query(`_x_id=${version}-${timestamp}`)
    .field('name', name)
    .field('mode', 'data')
    .field('token', apiToken)
    .attach('image', file)
    .use(superagentThrottle.plugin())
    .end((error, response) => {
      const uploadError = error || _.get(response.body, 'error');
      callback(uploadError, response);
    });

  return id;
}
