'use strict';

var utils = require('./utils');

var Gallery = function() {
  var self = this;

  this.element = document.querySelector('.gallery-overlay');
  this.closeElement = this.element.querySelector('.gallery-overlay-close');
  var likes = this.element.querySelector('.likes-count');
  var comments = this.element.querySelector('.comments-count');
  this.preview = this.element.querySelector('.gallery-overlay-image');

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
    this.preview.src = this.galleryPictures[actPicture].url;
    likes.textContent = this.galleryPictures[actPicture].likes;
    comments.textContent = this.galleryPictures[actPicture].comments;
  };

  this._onPhotoClick = function() {
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
    this.preview.addEventListener('click', this._onPhotoClick);
    document.addEventListener('keydown', this._onDocumentKeyDown);
    this.closeElement.addEventListener('click', this._onCloseClickHandler);
  };

  this.hideGallery = function() {
    this.element.classList.add('invisible');
    this.preview.removeEventListener('click', this._onPhotoClick);
    document.removeEventListener('keydown', this._onDocumentKeyDown);
    this.closeElement.removeEventListener('click', this._onCloseClickHandler);
  };
};

var photoGallery = new Gallery();

module.exports = {
  showGallery: function(param) {
    photoGallery.activePicture = photoGallery.galleryPictures.indexOf(param);
    photoGallery.setActivePicture(photoGallery.activePicture);

    photoGallery.element.classList.remove('invisible');
    photoGallery.preview.addEventListener('click', photoGallery._onPhotoClick);
    document.addEventListener('keydown', photoGallery._onDocumentKeyDown);
    photoGallery.closeElement.addEventListener('click', photoGallery._onCloseClickHandler);
  },
  savePictures: function(param) {
    if (param !== photoGallery.galleryPictures) {
      photoGallery.galleryPictures = [];

      photoGallery.galleryPictures = param;

      param.forEach(function(pic) {
        var pictureElement = new Image();
        pictureElement.src = pic;
      }, photoGallery);
    }
  }
};
