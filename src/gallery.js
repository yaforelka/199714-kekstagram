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

  var _onCloseClickHandler = function() {
    self.hideGallery();
  };


  var _onDocumentKeyDown = function(evt) {
    if (utils.isDeactivationEvent(evt)) {
      evt.preventDefault();
      self.hideGallery();
    }
  };


  var setActivePicture = function(actPicture) {
    preview.src = galleryPictures[actPicture].url;
    likes.textContent = galleryPictures[actPicture].likes;
    comments.textContent = galleryPictures[actPicture].comments;
  };

  var _onPhotoClick = function() {
    self.activePicture += 1;
    if (self.activePicture === galleryPictures.length) {
      self.activePicture = 0;
    }
    setActivePicture(self.activePicture);
  };

  this.showGallery = function(picture) {
    this.activePicture = galleryPictures.indexOf(picture);
    setActivePicture(this.activePicture);
    self.element.classList.remove('invisible');
    preview.addEventListener('click', _onPhotoClick);
    document.addEventListener('keydown', _onDocumentKeyDown);
    closeElement.addEventListener('click', _onCloseClickHandler);
  };

  this.hideGallery = function() {
    this.element.classList.add('invisible');
    preview.removeEventListener('click', this._onPhotoClick);
    document.removeEventListener('keydown', this._onDocumentKeyDown);
    closeElement.removeEventListener('click', this._onCloseClickHandler);
  };
};

var photoGallery = new Gallery();

module.exports = {
  showGallery: photoGallery.showGallery,
  savePictures: photoGallery.savePictures
};
