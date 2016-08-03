'use strict';

  /**
   * @constructor
   * @param {string} image
   */
var Resizer = function(image) {
  this._image = new Image();
  this._image.src = image;

  this._container = document.createElement('canvas');
  this._ctx = this._container.getContext('2d');

  this._image.onload = function() {
    this._container.width = this._image.naturalWidth;
    this._container.height = this._image.naturalHeight;

    /**
      * @const
      * @type {number}
      */
    var INITIAL_SIDE_RATIO = 0.75;

    var side = Math.min(
        this._container.width * INITIAL_SIDE_RATIO,
        this._container.height * INITIAL_SIDE_RATIO);

    this._resizeConstraint = new Square(
        this._container.width / 2 - side / 2,
        this._container.height / 2 - side / 2,
        side);

    this.setConstraint();
  }.bind(this);

  this._onDragStart = this._onDragStart.bind(this);
  this._onDragEnd = this._onDragEnd.bind(this);
  this._onDrag = this._onDrag.bind(this);
};

Resizer.prototype = {
  /**
    * @type {Element}
    * @private
    */
  _element: null,

  /**
    * @type {Coordinate}
    * @private
    */
  _cursorPosition: null,

  /**
    * @type {Square}
    * @private
    */
  _resizeConstraint: null,

  redraw: function() {
    this._ctx.clearRect(0, 0, this._container.width, this._container.height);
    this._ctx.save();
    this._ctx.translate(this._container.width / 2, this._container.height / 2);

    var displX = -(this._resizeConstraint.x + this._resizeConstraint.side / 2);
    var displY = -(this._resizeConstraint.y + this._resizeConstraint.side / 2);
    var x = -this._resizeConstraint.side / 2;
    var y = -this._resizeConstraint.side / 2;

    this._ctx.drawImage(this._image, displX, displY);

    while (x < this._resizeConstraint.side / 2) {
      this._ctx.beginPath();
      this._ctx.arc(x, -this._resizeConstraint.side / 2, 2, 0, 2 * Math.PI);
      this._ctx.fillStyle = '#ffe753';
      this._ctx.fill();
      x += 8;
    }

    while (y < this._resizeConstraint.side / 2) {
      this._ctx.beginPath();
      this._ctx.arc(this._resizeConstraint.side / 2, y, 2, 0, 2 * Math.PI);
      this._ctx.fillStyle = '#ffe753';
      this._ctx.fill();
      y += 8;
    }

    x = -this._resizeConstraint.side / 2;
    y = -this._resizeConstraint.side / 2;

    while (x <= this._resizeConstraint.side / 2) {
      this._ctx.beginPath();
      this._ctx.arc(x, this._resizeConstraint.side / 2, 2, 0, 2 * Math.PI);
      this._ctx.fillStyle = '#ffe753';
      this._ctx.fill();
      x += 8;
    }

    while (y < this._resizeConstraint.side / 2) {
      this._ctx.beginPath();
      this._ctx.arc(-this._resizeConstraint.side / 2, y, 2, 0, 2 * Math.PI);
      this._ctx.fillStyle = '#ffe753';
      this._ctx.fill();
      y += 8;
    }

    this._ctx.restore();

    this._ctx.font = '20px Tahoma';
    this._ctx.fillStyle = 'white';
    this._ctx.textAlign = 'center';
    this._ctx.fillText(this._image.naturalWidth + ' x ' + this._image.naturalHeight,
    this._container.width / 2, this._container.height / 2 - this._resizeConstraint.side / 2 - 10);
  },

  /**
    * @param {number} x
    * @param {number} y
    * @private
    */
  _enterDragMode: function(x, y) {
    this._cursorPosition = new Coordinate(x, y);
    document.body.addEventListener('mousemove', this._onDrag);
    document.body.addEventListener('mouseup', this._onDragEnd);
  },

  /**
   * @private
   */
  _exitDragMode: function() {
    this._cursorPosition = null;
    document.body.removeEventListener('mousemove', this._onDrag);
    document.body.removeEventListener('mouseup', this._onDragEnd);
  },

  /**
   * Перемещение изображения относительно кадра.
   * @param {number} x
   * @param {number} y
   * @private
   */
  updatePosition: function(x, y) {
    this.moveConstraint(
        this._cursorPosition.x - x,
        this._cursorPosition.y - y);
    this._cursorPosition = new Coordinate(x, y);
  },

  /**
   * @param {MouseEvent} evt
   * @private
   */
  _onDragStart: function(evt) {
    this._enterDragMode(evt.clientX, evt.clientY);
  },

  /**
   * @private
   */
  _onDragEnd: function() {
    this._exitDragMode();
  },

  /**
   * @param {MouseEvent} evt
   * @private
   */
  _onDrag: function(evt) {
    this.updatePosition(evt.clientX, evt.clientY);
  },

  /**
   * @param {Element} element
   */
  setElement: function(element) {
    if (this._element === element) {
      return;
    }

    this._element = element;
    this._element.insertBefore(this._container, this._element.firstChild);
    this._container.addEventListener('mousedown', this._onDragStart);
  },

  /**
   * @return {Square}
   */
  getConstraint: function() {
    return this._resizeConstraint;
  },

  /**
   * @param {number} deltaX
   * @param {number} deltaY
   * @param {number} deltaSide
   */
  moveConstraint: function(deltaX, deltaY, deltaSide) {
    this.setConstraint(
        this._resizeConstraint.x + (deltaX || 0),
        this._resizeConstraint.y + (deltaY || 0),
        this._resizeConstraint.side + (deltaSide || 0));
  },

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} side
   */
  setConstraint: function(x, y, side) {
    if (typeof x !== 'undefined') {
      this._resizeConstraint.x = x;
    }

    if (typeof y !== 'undefined') {
      this._resizeConstraint.y = y;
    }

    if (typeof side !== 'undefined') {
      this._resizeConstraint.side = side;
    }

    requestAnimationFrame(function() {
      this.redraw();
      window.dispatchEvent(new CustomEvent('resizerchange'));
    }.bind(this));
  },

  remove: function() {
    this._element.removeChild(this._container);
    this._container.removeEventListener('mousedown', this._onDragStart);
    this._container = null;
  },

  /**
   * @return {Image}
   */
  exportImage: function() {
    var imageToExport = new Image();

    var temporaryCanvas = document.createElement('canvas');
    var temporaryCtx = temporaryCanvas.getContext('2d');
    temporaryCanvas.width = this._resizeConstraint.side;
    temporaryCanvas.height = this._resizeConstraint.side;
    temporaryCtx.drawImage(this._image,
        -this._resizeConstraint.x,
        -this._resizeConstraint.y);
    imageToExport.src = temporaryCanvas.toDataURL('image/png');

    return imageToExport;
  }
};

/**
 * @constructor
 * @param {number} x
 * @param {number} y
 * @param {number} side
 * @private
  */
var Square = function(x, y, side) {
  this.x = x;
  this.y = y;
  this.side = side;
};

/**
  * @constructor
  * @param {number} x
  * @param {number} y
  * @private
  */
var Coordinate = function(x, y) {
  this.x = x;
  this.y = y;
};

module.exports = Resizer;
