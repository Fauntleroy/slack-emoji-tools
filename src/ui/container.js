
const setIconUrl = chrome.runtime.getURL('images/icon_128.png');

export default function addContainerDiv(beforeElement) {
  const containerDiv = document.createElement('div');
  beforeElement.before(containerDiv);
  containerDiv.innerHTML = `
    <div class="neutral-face-emoji-tools">
      <h4 class="nfet__uploader__heading">
        <img class="nfet__uploader__heading__icon" src="${setIconUrl}"></img>
        <span class="nfet__uploader__heading__text">Bulk Emoji Uploader</span>
      </h4>
      <p class="nfet__uploader__subheading">Drag and drop images into the area below. Any images dropped there will be automatically uploaded using their filename as the emoji name.</p>
      <p class="nfet__uploader__input-note input_note">Example: <span class="normal">"ditto.gif" will be added as "ditto"</span></p>
      <div id="nfet-upload-zone" class="nfet__uploader__dropzone">
        <div class="nfet__uploader__dropzone__content input_note">
          <strong>Drop images here</strong> or click to open a file dialog
        </div>
        <input class="nfet__uploader__dropzone__input" id="nfet-upload-input" type="file" />
      </div>
      <ul class="nfet__uploader__uploads"></ul>
    </div>`;
}