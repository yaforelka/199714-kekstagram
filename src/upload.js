/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';
(function() {
  var Resizer = require('./resizer');

  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  var utils = require('./utils');

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  var currentValues;
  var newLeft;
  var newTop;
  var errorMessageDiv = document.querySelector('#resize-image-src');

  /**
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap = {
    'none': 'filter-none',
    'chrome': 'filter-chrome',
    'sepia': 'filter-sepia'
  };

  /**
   * @type {Resizer}
   */
  var currentResizer;

  /**
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  var resizeForm = document.forms['upload-resize'];

  var fromLeft = resizeForm.querySelector('#resize-x');
  var fromTop = resizeForm.querySelector('#resize-y');
  var sizeSide = resizeForm.querySelector('#resize-size');
  var buttonSubmit = resizeForm.querySelector('#resize-fwd');

  /**
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  function cleanupResizer() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  }

  function updateBackground() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  }

  fromLeft.min = 0;
  fromTop.min = 0;
  sizeSide.min = 0;
  /**
   * @return {boolean}
   */
  function resizeFormIsValid() {
    fromLeft.max = utils.setLeftConstraint(fromLeft, sizeSide.value, currentResizer._image.naturalWidth);
    fromTop.max = utils.setTopConstraint(fromTop, sizeSide.value, currentResizer._image.naturalHeight);
    sizeSide.max = utils.setSideConstraint(sizeSide, fromLeft.value, fromTop.value,
      currentResizer._image.naturalWidth, currentResizer._image.naturalHeight);

    return [fromLeft, fromTop, sizeSide].every(function(item) {
      return item.checkValidity();
    });
  }


  var _onResizerChange = function() {
    var defaultValues = currentResizer.getConstraint();
    fromLeft.value = defaultValues.x;
    fromTop.value = defaultValues.y;
    sizeSide.value = defaultValues.side;
  };

  var _onInput = function(evt) {
    if (!resizeFormIsValid()) {
      buttonSubmit.setAttribute('disabled', 'disabled');
      buttonSubmit.style.background = '#505050';
      errorMessageDiv.classList.remove('invisible');
      [fromLeft, fromTop, sizeSide].forEach(function(item) {
        if (!item.checkValidity()) {
          errorMessageDiv.innerHTML = item.validationMessage;
        }
      });
    } else {
      buttonSubmit.removeAttribute('disabled', 'disabled');
      buttonSubmit.removeAttribute('style');
      errorMessageDiv.classList.add('invisible');
      errorMessageDiv.innerHTML = '';
    }
    if (evt.target === fromLeft || evt.target === fromTop) {
      currentResizer.setConstraint(+fromLeft.value, +fromTop.value, +sizeSide.value);
    } else if (evt.target === sizeSide) {
      currentValues = currentResizer.getConstraint();
      newLeft = +fromLeft.value + (currentValues.side - +sizeSide.value) / 2;
      newTop = +fromTop.value + (currentValues.side - +sizeSide.value) / 2;
      if (Math.abs(newLeft - +fromLeft.value) > 0.5 && Math.abs(newTop - +fromTop.value) > 0.5) {
        currentResizer.setConstraint(newLeft, newTop, +sizeSide.value);
      }
    }
  };

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  function showMessage(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  }

  function hideMessage() {
    uploadMessage.classList.add('invisible');
  }

  /**
   * @param {Event} evt
   */
  var _onChange = function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        var _onLoad = function() {
          cleanupResizer();
          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);
          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');
          resizeForm.addEventListener('reset', _onReset);
          resizeForm.addEventListener('input', _onInput);
          resizeForm.addEventListener('submit', _onSubmit);
          window.addEventListener('resizerchange', _onResizerChange);
          window.addEventListener('resizerchange', _onInput);
          hideMessage();
        };

        fileReader.addEventListener('load', _onLoad);
        fileReader.readAsDataURL(element.files[0]);
      } else {
        showMessage(Action.ERROR);
      }
    }
  };

  var _onReset = function(evt) {
    evt.preventDefault();
    if (evt.target === resizeForm) {
      cleanupResizer();
      updateBackground();

      resizeForm.classList.add('invisible');
      utils.getCookie(filterImage, filterMap);
      uploadForm.classList.remove('invisible');
    } else if (evt.target === filterForm) {
      filterForm.classList.add('invisible');
      resizeForm.classList.remove('invisible');
    }
  };

  uploadForm.addEventListener('change', _onChange);

  /**
   * @param {Event} evt
   */
  var _onSubmit = function(evt) {
    evt.preventDefault();
    if (evt.target === resizeForm) {
      filterImage.src = currentResizer.exportImage().src;
      resizeForm.classList.add('invisible');
      filterForm.addEventListener('change', _onChangeFilter);
      filterForm.addEventListener('reset', _onReset);
      filterForm.addEventListener('submit', _onSubmit);
      filterForm.classList.remove('invisible');
    } else if (evt.target === filterForm) {
      utils.setCookie();
      cleanupResizer();
      updateBackground();
      window.removeEventListener('resizerchange', _onResizerChange);
      window.removeEventListener('resizerchange', _onInput);
      filterForm.removeEventListener('change', _onChangeFilter);
      filterForm.removeEventListener('reset', _onReset);
      filterForm.removeEventListener('submit', _onSubmit);
      resizeForm.removeEventListener('reset', _onReset);
      resizeForm.removeEventListener('input', _onInput);
      resizeForm.removeEventListener('submit', _onSubmit);
      filterForm.classList.add('invisible');
      uploadForm.classList.remove('invisible');
    }
  };

  var _onChangeFilter = function() {
    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
  };
  cleanupResizer();
  updateBackground();
})();
