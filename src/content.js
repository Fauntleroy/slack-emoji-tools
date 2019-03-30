import elementReady from 'element-ready';
import get from 'lodash.get';
import queue from 'queue';
import { SimpleDropzone } from 'simple-dropzone';
import uploadEmoji from './upload-emoji';
import './styles/content.less'; // Just to get it into the parcel build
import getSlackErrorMessage from './slack-error-messages';
import * as UI from './ui';

const ELEMENT_TO_INSERT_BEFORE_SELECTOR = '.p-customize_emoji_wrapper';


elementReady(ELEMENT_TO_INSERT_BEFORE_SELECTOR).then(element => {
  UI.injectStyling();
  UI.addContainerDiv(element);

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
  element.querySelector('.nfet__uploader__upload__status__text').innerText = 'Added successfully';
}

function failedUpload(element, error) {
  const errorMessasge = getSlackErrorMessage(error);
  element.classList.add('nfet__uploader__upload--error');
  element.querySelector('.nfet__uploader__upload__status__text').innerText = errorMessasge;
  console.log('Failed Upload', error);
}
