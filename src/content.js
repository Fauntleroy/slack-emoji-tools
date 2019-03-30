import elementReady from 'element-ready';
import get from 'lodash.get';
import queue from 'queue';
import { SimpleDropzone } from 'simple-dropzone';
import uploadEmoji from './upload-emoji';
import './styles/content.less'; // Just to get it into the parcel build

const ELEMENT_TO_INSERT_BEFORE_SELECTOR = '.p-customize_emoji_wrapper';
const SET_ICON_URL = chrome.runtime.getURL('images/icon_128.png');

elementReady(ELEMENT_TO_INSERT_BEFORE_SELECTOR).then(() => {
  addStyling();
  const elementToInsertBefore = document.querySelector(ELEMENT_TO_INSERT_BEFORE_SELECTOR);
  const containerDiv = document.createElement('div');

  elementToInsertBefore.before(containerDiv);

  containerDiv.innerHTML = `
    <div class="neutral-face-emoji-tools">
      <h4 class="nfet__uploader__heading">
        <img class="nfet__uploader__heading__icon" src="${SET_ICON_URL}"></img>
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
  const uploadInputElement = document.querySelector('#nfet-upload-input');
  const uploadZoneElement = document.querySelector('#nfet-upload-zone');
  const dropzone = new SimpleDropzone(uploadZoneElement, uploadInputElement);
  const uploadsElement = document.querySelector('.neutral-face-emoji-tools .nfet__uploader__uploads');
  const q = queue({ concurrency: 5 });

  dropzone.on('drop', ({ files }) => {
    files.forEach(file => {
      const uploadElement = createUploadElement(file);
      uploadsElement.appendChild(uploadElement);

      q.push(callback => {
        uploadEmoji(file)
          .then(response => {
            const ok = get(response, ['data', 'ok']);
            if (ok) {
              successfulUpload(uploadElement);
            }
            else {
              const error = get(response, ['data', 'error']);
              failedUpload(uploadElement, error);
            }
          })
          .catch(error => {
            failedUpload(uploadElement, error);
          })
          .finally(() => {
            callback();
          });
      });
    });
    q.start();
  });
});

function addStyling() {
  const styleUrl = chrome.runtime.getURL('content.css');
  const link = document.createElement('link');
  link.setAttribute('rel', 'StyleSheet');
  link.setAttribute('href', styleUrl);
  link.setAttribute('type', 'text/css');
  link.setAttribute('id', 'dingus');
  document.body.append(link);
}

let uploadElementId = 0;
function createUploadElement (file) {
  const filePreview = window.URL.createObjectURL(file);
  const element = document.createElement('li');
  element.id = `nfet__upload-${uploadElementId++}`;
  element.classList.add('nfet__uploader__upload');
  element.innerHTML = `
    <img class="nfet__uploader__upload__preview" src="${filePreview}" />
    <span class="nfet__uploader__upload__filename">${file.name}</span>
    <span class="nfet__uploader__upload__status">
      <i class="nfet__uploader__upload__status__icon nfet__uploader__upload__status__icon-uploading ts_icon ts_icon_spinner"></i>
      <i class="nfet__uploader__upload__status__icon nfet__uploader__upload__status__icon-error ts_icon ts_icon_warning"></i>
      <i class="nfet__uploader__upload__status__icon nfet__uploader__upload__status__icon-success ts_icon ts_icon_check_circle_o"></i>
      <span class="nfet__uploader__upload__status__text"></span>
    </span>`;

  return element;
}

function successfulUpload(element) {
  element.classList.add('nfet__uploader__upload--success');
  element.querySelector('.nfet__uploader__upload__status__text').innerText = 'added successfully';
}

function failedUpload(element, error) {
  element.classList.add('nfet__uploader__upload--error');
  element.querySelector('.nfet__uploader__upload__status__text').innerText = error;
  console.log('Failed Upload', error);
}
