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
    preview.src = galleryPictures[actPicture].url;
    likes.textContent = galleryPictures[actPicture].likes;
    comments.textContent = galleryPictures[actPicture].comments;
  };

  this._onPhotoClick = function() {
    self.activePicture += 1;
    if (self.activePicture === galleryPictures.length) {
      self.activePicture = 0;
    }
    self.setActivePicture(self.activePicture);
  };

  this.showGallery = function(picture) {
    self.activePicture = galleryPictures.indexOf(picture);
    self.setActivePicture(self.activePicture);
    self.element.classList.remove('invisible');
    preview.addEventListener('click', self._onPhotoClick);
    document.addEventListener('keydown', self._onDocumentKeyDown);
    closeElement.addEventListener('click', self._onCloseClickHandler);
  };

  this.hideGallery = function() {
    this.element.classList.add('invisible');
    preview.removeEventListener('click', self._onPhotoClick);
    document.removeEventListener('keydown', self._onDocumentKeyDown);
    closeElement.removeEventListener('click', self._onCloseClickHandler);
  };
};

var photoGallery = new Gallery();

module.exports = {
  showGallery: photoGallery.showGallery,
  savePictures: photoGallery.savePictures
};
