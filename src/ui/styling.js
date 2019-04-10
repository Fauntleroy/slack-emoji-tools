
export default function injectStyling() {
  const styleUrl = chrome.runtime.getURL('content.css');
  const link = document.createElement('link');
  link.setAttribute('rel', 'StyleSheet');
  link.setAttribute('href', styleUrl);
  link.setAttribute('type', 'text/css');
  link.setAttribute('id', 'neutral-face-emoji-tools-styling');
  document.body.append(link);
}
