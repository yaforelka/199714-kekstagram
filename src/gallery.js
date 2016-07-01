'use strict';

var utils = require('./utils');

var Gallery = function() {

  this.element = document.querySelector('.gallery-overlay');
  this.closeElement = this.element.querySelector('.gallery-overlay-close');
  this.likes = this.element.querySelector('.likes-count');
  this.comments = this.element.querySelector('.comments-count');
  this.preview = this.element.querySelector('.gallery-overlay-image');

  this.galleryPictures = [];
  this.activePicture = 0;

  this.savePictures = this.savePictures.bind(this);
  this._onCloseClickHandler = this._onCloseClickHandler.bind(this);
  this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  this.setActivePicture = this.setActivePicture.bind(this);
  this._onPhotoClick = this._onPhotoClick.bind(this);
  this.showGallery = this.showGallery.bind(this);
  this.hideGallery = this.hideGallery.bind(this);
  this._onHashChange = this._onHashChange.bind(this);
  window.addEventListener('hashchange', this._onHashChange);
};

Gallery.prototype.savePictures = function(pictures) {
  if (pictures !== this.galleryPictures) {
    this.galleryPictures = [];
    this.galleryPictures = pictures;

    pictures.forEach(function(pic) {
      var pictureElement = new Image();
      pictureElement.src = pic;
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
  this.galleryPictures.filter(function(item, i) {
    if (item.url === actPicture) {
      this.activePicture = i;
      this.preview.src = actPicture;
      this.likes.textContent = item.likes;
      this.comments.textContent = item.comments;
    }
    return this.activePicture;
  }, this);
};

Gallery.prototype._onPhotoClick = function() {
  this.activePicture += 1;
  if (this.activePicture === this.galleryPictures.length) {
    this.activePicture = 0;
  }
  var currentSrc = this.galleryPictures[this.activePicture].url;
  window.location.hash = '#photo/' + currentSrc;
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

Gallery.prototype._onHashChange = function() {
  var hash = window.location.hash;
  var getPhotoRegExp = /#photo\/(\S+)/.exec(hash);
  if (getPhotoRegExp) {
    if (this.galleryPictures.some(function(item) {
      return item.url === getPhotoRegExp[1];
    })) {
      this.showGallery(getPhotoRegExp[1]);
    } else {
      this.hideGallery();
    }
  } else {
    this.hideGallery();
  }
};

var photoGallery = new Gallery();

module.exports = {
  showGallery: photoGallery._onHashChange,
  savePictures: photoGallery.savePictures
};
