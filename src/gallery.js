'use strict';

var utils = require('./utils');

var Gallery = function() {
  var self = this;

  this.element = document.querySelector('.gallery-overlay');
  var closeElement = this.element.querySelector('.gallery-overlay-close');
  var likes = this.element.querySelector('.likes-count');
  var comments = this.element.querySelector('.comments-count');
  var preview = this.element.querySelector('.gallery-overlay-image');

  this.galleryPictures = [];
  this.activePicture = 0;

  this.savePictures = function(pictures) {
    if (pictures !== this.galleryPictures) {
      this.galleryPictures = [];

      this.galleryPictures = pictures;

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
    preview.src = this.galleryPictures[actPicture].url;
    likes.textContent = this.galleryPictures[actPicture].likes;
    comments.textContent = this.galleryPictures[actPicture].comments;
  };

  var _onPhotoClick = function() {
    self.activePicture += 1;
    if (self.activePicture === self.galleryPictures.length) {
      self.activePicture = 0;
    }
    self.setActivePicture(self.activePicture);
  };

  this.showGallery = function(picture) {
    this.activePicture = this.galleryPictures.indexOf(picture);
    this.setActivePicture(this.activePicture);

    this.element.classList.remove('invisible');
    preview.addEventListener('click', _onPhotoClick);
    document.addEventListener('keydown', this._onDocumentKeyDown);
    closeElement.addEventListener('click', this._onCloseClickHandler);
  };

  this.hideGallery = function() {
    this.element.classList.add('invisible');
    preview.removeEventListener('click', _onPhotoClick);
    document.removeEventListener('keydown', this._onDocumentKeyDown);
    closeElement.removeEventListener('click', this._onCloseClickHandler);
  };
};

var photoGallery = new Gallery();

var saveOrShow = function(param) {
  if (Array.isArray(param)) {
    photoGallery.savePictures(param);
  } else {
    photoGallery.showGallery(param);
  }
};

module.exports = saveOrShow;
