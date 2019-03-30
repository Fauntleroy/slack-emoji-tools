export default function getSlackApiData () {
  const scripts = document.querySelectorAll('script[type="text/javascript"]');
  let token;
  let versionUid;

  scripts.forEach((script) => {
    const isBootDataScript = /var\sboot_data\s\=\s\{/.test(script.innerText);

    if (!isBootDataScript) {
      return;
    }

    const apiTokenResult = /["]?api_token["]?\:\s*\"(.+?)\"/g.exec(script.innerText);
    const versionUidResult = /["]?version_uid["]?\:\s*\"(.+?)\"/g.exec(script.innerText);

    if (apiTokenResult) {
      token = apiTokenResult[1];
    }

    if (versionUidResult) {
      versionUid = versionUidResult[1];
    }
  });

  return {
    token,
    versionUid
  };
}