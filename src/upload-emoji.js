import get from 'lodash.get';
import axios from 'axios';
import getSlackApiData from './get-slack-api-data';
export default function uploadEmoji(file) {
  const { token, versionUid } = getSlackApiData();
  const timestamp = Date.now() / 1000;  
  const version = versionUid ? versionUid.substring(0, 8) : 'noversion';
  
  const name = file.name.split('.')[0];

  const formData = new FormData();
  formData.append('_x_id', `${version}-${timestamp}`)
  formData.append('name', name);
  formData.append('token', token);
  formData.append('mode', 'data');
  formData.append('image', file);

  return axios.post('/api/emoji.add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  // superagent.post('/api/emoji.add')
  //   .withCredentials()
  //   .query(`_x_id=${version}-${timestamp}`)
  //   .field('name', name)
  //   .field('mode', 'data')
  //   .field('token', apiToken)
  //   .attach('image', file)
  //   .use(superagentThrottle.plugin())
  //   .end((error, response) => {
  //     const uploadError = error || get(response.body, 'error');   <<<<<------------------
  //     callback(uploadError, response);
  //   });
}