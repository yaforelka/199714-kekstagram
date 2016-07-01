'use strict';

var utils = require('./utils');

var Gallery = function() {
  var self = this;

  this.element = document.querySelector('.gallery-overlay');
  var closeElement = this.element.querySelector('.gallery-overlay-close');
  var likes = this.element.querySelector('.likes-count');
  var comments = this.element.querySelector('.comments-count');
  var preview = this.element.querySelector('.gallery-overlay-image');

  var galleryPictures = [];
  var currentSrc;
  this.activePicture = 0;

  this.savePictures = function(pictures) {
    if (pictures !== galleryPictures) {
      galleryPictures = [];
      galleryPictures = pictures;

      pictures.forEach(function(pic) {
        var pictureElement = new Image();
        pictureElement.src = pic;
      }, this);
    }
  };

  this._onCloseClickHandler = function() {
    self.hideGallery();
  };


  this._onDocumentKeyDown = function(evt) {
    if (utils.isDeactivationEvent(evt)) {
      evt.preventDefault();
      self.hideGallery();
    }
  };


  this.setActivePicture = function(actPicture) {
    galleryPictures.filter(function(item, i) {
      if (item.url === actPicture) {
        self.activePicture = i;
        preview.src = actPicture;
        likes.textContent = item.likes;
        comments.textContent = item.comments;
      }
      return self.activePicture;
    });
  };

  this._onPhotoClick = function() {
    self.activePicture += 1;
    if (self.activePicture === galleryPictures.length) {
      self.activePicture = 0;
    }
    currentSrc = galleryPictures[self.activePicture].url;
    window.location.hash = '#photo/' + currentSrc;
  };

  this.showGallery = function(picture) {
    self.setActivePicture(picture);
    self.element.classList.remove('invisible');
    preview.addEventListener('click', self._onPhotoClick);
    document.addEventListener('keydown', self._onDocumentKeyDown);
    closeElement.addEventListener('click', self._onCloseClickHandler);
  };

  this.hideGallery = function() {
    this.element.classList.add('invisible');
    location.hash = '';
    preview.removeEventListener('click', self._onPhotoClick);
    document.removeEventListener('keydown', self._onDocumentKeyDown);
    closeElement.removeEventListener('click', self._onCloseClickHandler);
  };

  this._onHashChange = function() {
    var hash = window.location.hash;
    var getPhotoRegExp = /#photo\/(\S+)/.exec(hash);
    if (getPhotoRegExp) {
      if (galleryPictures.some(function(item) {
        return item.url === getPhotoRegExp[1];
      })) {
        self.showGallery(getPhotoRegExp[1]);
      } else {
        self.hideGallery();
      }
    } else {
      self.hideGallery();
    }
  };
  window.addEventListener('hashchange', self._onHashChange);
};

var photoGallery = new Gallery();

module.exports = {
  showGallery: photoGallery._onHashChange,
  savePictures: photoGallery.savePictures
};
