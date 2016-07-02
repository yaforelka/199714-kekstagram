'use strict';

var utils = require('./utils');

var Gallery = function() {
  this.element = document.querySelector('.gallery-overlay');
  this.closeElement = this.element.querySelector('.gallery-overlay-close');
  this.likes = this.element.querySelector('.likes-count');
  this.comments = this.element.querySelector('.comments-count');
  this.preview = this.element.querySelector('.gallery-overlay-image');

  this.galleryPictures = [];
  this.picturesSrc = [];
  this.activePicture = 0;

  this.savePictures = this.savePictures.bind(this);
  this.getHashContent = this.getHashContent.bind(this);

  this._onCloseClickHandler = this._onCloseClickHandler.bind(this);
  this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  this._onPhotoClick = this._onPhotoClick.bind(this);

  window.addEventListener('hashchange', this._onHashChange.bind(this));
};

Gallery.prototype.savePictures = function(pictures) {
  if (pictures !== this.galleryPictures) {
    this.galleryPictures = [];
    this.picturesSrc = [];
    this.galleryPictures = pictures;

    pictures.forEach(function(pic) {
      this.picturesSrc.push(pic.url);
    }, this);
  }
};

Gallery.prototype._onCloseClickHandler = function() {
  this.hideGallery();
};

Gallery.prototype._onDocumentKeyDown = function(evt) {
  if (utils.isDeactivationEvent(evt)) {
    evt.preventDefault();
    this.hideGallery();
  }
};

Gallery.prototype.setActivePicture = function(actPicture) {
  this.activePicture = this.picturesSrc.indexOf(actPicture);
  this.preview.src = this.galleryPictures[this.activePicture].url;
  this.likes.textContent = this.galleryPictures[this.activePicture].likes;
  this.comments.textContent = this.galleryPictures[this.activePicture].comments;
};

Gallery.prototype._onPhotoClick = function() {
  this.activePicture += 1;
  if (this.activePicture === this.galleryPictures.length) {
    this.activePicture = 0;
  }
  var nextSrc = this.picturesSrc[this.activePicture];
  window.location.hash = '#photo/' + nextSrc;
};

Gallery.prototype.showGallery = function(picture) {
  this.setActivePicture(picture);
  this.element.classList.remove('invisible');
  this.preview.addEventListener('click', this._onPhotoClick);
  document.addEventListener('keydown', this._onDocumentKeyDown);
  this.closeElement.addEventListener('click', this._onCloseClickHandler);
};

Gallery.prototype.hideGallery = function() {
  this.element.classList.add('invisible');
  location.hash = '';
  this.preview.removeEventListener('click', this._onPhotoClick);
  document.removeEventListener('keydown', this._onDocumentKeyDown);
  this.closeElement.removeEventListener('click', this._onCloseClickHandler);
};

Gallery.prototype.getHashContent = function() {
  if (location.hash !== '') {
    this._onHashChange();
  }
};

Gallery.prototype._onHashChange = function() {
  var hash = window.location.hash;
  var getPhotoRegExp = /#photo\/(\S+)/.exec(hash);
  if (getPhotoRegExp) {
    if (this.picturesSrc.indexOf(getPhotoRegExp[1]) > -1) {
      this.showGallery(getPhotoRegExp[1]);
    } else {
      this.hideGallery();
    }
  } else {
    location.hash = '';
  }
};

var photoGallery = new Gallery();

module.exports = {
  getHashContent: photoGallery.getHashContent,
  savePictures: photoGallery.savePictures
};
