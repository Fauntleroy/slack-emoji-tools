import getSlackErrorMessage from '../slack-error-messages';

let uploadElementId = 0;

export default class UploadElement {

  constructor(file) {
    this._file = file;
    this.element = this._injectElement();
    this.statusElement = this._getStatusElement();
  }

  successfulUpload() {
    this.element.classList.add('nfet__uploader__upload--success');
    this.statusElement.innerText = 'Added successfully';
  }
  
  failedUpload(error) {
    const errorMessasge = getSlackErrorMessage(error);
    this.element.classList.add('nfet__uploader__upload--error');
    this.statusElement.innerText = errorMessasge;
    console.log('Failed Upload', error);
  }

  // Private

  /**
   * @returns {HTMLLIElement}
   */
  _injectElement() {
    const filePreview = window.URL.createObjectURL(this._file);
    const element = document.createElement('li');
    element.id = `nfet__upload-${uploadElementId++}`;
    element.classList.add('nfet__uploader__upload');
    element.innerHTML = `
      <img class="nfet__uploader__upload__preview" src="${filePreview}" />
      <span class="nfet__uploader__upload__filename">${this._file.name}</span>
      <span class="nfet__uploader__upload__status">
        <i class="nfet__uploader__upload__status__icon nfet__uploader__upload__status__icon-uploading ts_icon ts_icon_spinner"></i>
        <i class="nfet__uploader__upload__status__icon nfet__uploader__upload__status__icon-error ts_icon ts_icon_warning"></i>
        <i class="nfet__uploader__upload__status__icon nfet__uploader__upload__status__icon-success ts_icon ts_icon_check_circle_o"></i>
        <span class="nfet__uploader__upload__status__text"></span>
      </span>`;
  
    return element;
  }

  /**
   * @returns {HTMLSpanElement}
   */
  _getStatusElement() {
    return this.element.querySelector('.nfet__uploader__upload__status__text');
  }
}
