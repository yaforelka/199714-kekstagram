/* global Resizer: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

(function() {
  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
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
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  function cleanupResizer() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  }

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
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

  /**
   * Проверяет, валидны ли данные, в форме кадрирования.
   * @return {boolean}
   */
  var fromLeft = document.querySelector('#resize-x');
  var fromTop = document.querySelector('#resize-y');
  var sizeSide = document.querySelector('#resize-size');
  var buttonSubmit = document.querySelector('#resize-fwd');
  fromLeft.min = 0;
  fromTop.min = 0;
  sizeSide.min = 0;
  function resizeFormIsValid() {
    var originalWidth = currentResizer._image.naturalWidth;
    var originalHeight = currentResizer._image.naturalHeight;
    var setSideConstraint = function(sideField, leftField, topField) {
      sideField = Math.min(originalWidth - leftField, originalHeight - topField);
      sizeSide.max = sideField >= 0 ? sideField : 0;
    };
    var setLeftConstraint = function(leftField, side) {
      leftField = originalWidth - side;
      fromLeft.max = leftField >= 0 ? leftField : 0;
    };
    var setTopConstraint = function(topField, side) {
      topField = originalHeight - side;
      fromTop.max = topField >= 0 ? topField : 0;
    };
    fromLeft.oninput = function() {
      setSideConstraint(sizeSide, fromLeft, fromTop);
    };
    fromTop.oninput = function() {
      setSideConstraint(sizeSide, fromLeft, fromTop);
    };
    sizeSide.oninput = function() {
      setLeftConstraint(fromLeft, sizeSide);
      setTopConstraint(fromTop, sizeSide);
    };
    setLeftConstraint(fromLeft, sizeSide.value);
    setTopConstraint(fromTop, sizeSide.value);
    setSideConstraint(sizeSide, fromLeft.value, fromTop.value);
    return (+fromLeft.value + +sizeSide.value <= originalWidth)
    && (+fromTop.value + +sizeSide.value <= originalHeight);
  }

  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];


  /**
   * Форма добавления фильтра.
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
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */
  uploadForm.onchange = function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        fileReader.onload = function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);

          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');

          hideMessage();
        };
        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если загружаемый файл, не является
        // поддерживаемым изображением.
        showMessage(Action.ERROR);
      }
    }
  };

  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  resizeForm.onreset = function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  resizeForm.oninput = function() {

    if (!resizeFormIsValid()) {
      buttonSubmit.setAttribute('disabled', 'disabled');
      buttonSubmit.style.background = '#505050';
    } else {
      buttonSubmit.removeAttribute('disabled', 'disabled');
      buttonSubmit.style.background = 'rgba(255, 231, 83, 0.2) url("../img/icon-arrow.png") center no-repeat';
    }
  };
  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */
  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();
    if (resizeFormIsValid()) {
      filterImage.src = currentResizer.exportImage().src;

      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');
    }
  };
  var browserCookies = require('browser-cookies');
  var inputElements = document.querySelectorAll('.upload-filter-controls input');
  switch(browserCookies.get('filter')) {
    case 'none':
      filterImage.className = 'filter-image-preview ' + filterMap['none'];
      document.querySelector('#upload-filter-none').setAttribute('checked', 'checked');
      break;
    case 'chrome':
      filterImage.className = 'filter-image-preview ' + filterMap['chrome'];
      document.querySelector('#upload-filter-chrome').setAttribute('checked', 'checked');
      break;
    case 'sepia':
      filterImage.className = 'filter-image-preview ' + filterMap['sepia'];
      document.querySelector('#upload-filter-sepia').setAttribute('checked', 'checked');
      break;
    default:
      filterImage.className = 'filter-image-preview ' + filterMap['none'];
      document.querySelector('#upload-filter-sepia').setAttribute('checked', 'checked');
  }
  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  filterForm.onreset = function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  };

  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */
  filterForm.onsubmit = function(evt) {
    evt.preventDefault();
    for (var i = 0; i < inputElements.length; i++) {
      if (inputElements[i].checked) {
        var userFilter = inputElements[i];
      }
    }
    var birthDate = new Date();
    birthDate.setMonth(9);
    birthDate.setDate(10);
    var lifeTime = Date.now() - birthDate;
    if (lifeTime < 0) {
      lifeTime = lifeTime + 365 * 24 * 60 * 60 * 1000;
    }
    browserCookies.set('filter', userFilter.value, {expires: Date.now() +
     lifeTime});
    cleanupResizer();
    updateBackground();

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  filterForm.onchange = function() {

    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
  };

  cleanupResizer();
  updateBackground();
})();
