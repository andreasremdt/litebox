"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Litebox = function () {
  function Litebox(options) {
    _classCallCheck(this, Litebox);

    if (!Litebox._isObject(options)) {
      this.options = Litebox.defaults;
    } else {
      this.options = Litebox._merge(Litebox.defaults, options);
    }

    this._current = null;
    this.VERSION = '0.8.2';

    this._init();
  }

  _createClass(Litebox, [{
    key: "_init",
    value: function _init() {
      this._buildCollection();

      this._createElements();

      this._applyAttributes();

      this._createStructure();

      this._registerKeyboardEvents();

      this._registerMouseEvents();

      this._registerTouchEvents();
    }
  }, {
    key: "_createElements",
    value: function _createElements() {
      this._structure = {
        'BUTTON_CLOSE': document.createElement('button'),
        'BUTTON_NEXT': document.createElement('button'),
        'BUTTON_PREV': document.createElement('button'),
        'OUTER_WRAPPER': document.createElement('div'),
        'INNER_WRAPPER': document.createElement('div'),
        'FIGURE': document.createElement('figure'),
        'CAPTION': document.createElement('figcaption'),
        'IMAGE': document.createElement('img'),
        'LOADER': document.createElement('div'),
        'ERROR': document.createElement('div')
      };
    }
  }, {
    key: "_applyAttributes",
    value: function _applyAttributes() {
      this._structure.OUTER_WRAPPER.className = "".concat(this.options.classNames.outer).concat(this.options.animations ? ' is-animated animate-in' : '');
      this._structure.INNER_WRAPPER.className = this.options.classNames.inner;
      this._structure.BUTTON_CLOSE.className = "".concat(this.options.classNames.buttonGeneral, " ").concat(this.options.classNames.buttonClose, " ").concat(this.options.classNames.hidden);
      this._structure.BUTTON_CLOSE.textContent = this.options.labels.close;
      this._structure.BUTTON_NEXT.className = "".concat(this.options.classNames.buttonGeneral, " ").concat(this.options.classNames.buttonNext, " ").concat(this.options.classNames.hidden);
      this._structure.BUTTON_NEXT.textContent = this.options.labels.next;
      this._structure.BUTTON_PREV.className = "".concat(this.options.classNames.buttonGeneral, " ").concat(this.options.classNames.buttonPrev, " ").concat(this.options.classNames.hidden);
      this._structure.BUTTON_PREV.textContent = this.options.labels.prev;
      this._structure.FIGURE.className = this.options.classNames.figure;
      this._structure.CAPTION.className = "".concat(this.options.classNames.caption, " ").concat(this.options.classNames.hidden);
      this._structure.IMAGE.className = "".concat(this.options.classNames.image, " ").concat(this.options.classNames.hidden);
      this._structure.LOADER.className = "".concat(this.options.classNames.loader, " ").concat(this.options.classNames.hidden);
      this._structure.ERROR.className = "".concat(this.options.classNames.error, " ").concat(this.options.classNames.hidden);
      this._structure.ERROR.textContent = this.options.labels.error;
    }
  }, {
    key: "_createStructure",
    value: function _createStructure() {
      this._structure.OUTER_WRAPPER.appendChild(this._structure.INNER_WRAPPER);

      this._structure.OUTER_WRAPPER.appendChild(this._structure.LOADER);

      this._structure.OUTER_WRAPPER.appendChild(this._structure.ERROR);

      this._structure.INNER_WRAPPER.appendChild(this._structure.BUTTON_CLOSE);

      this._structure.INNER_WRAPPER.appendChild(this._structure.BUTTON_NEXT);

      this._structure.INNER_WRAPPER.appendChild(this._structure.BUTTON_PREV);

      this._structure.INNER_WRAPPER.appendChild(this._structure.FIGURE);

      this._structure.FIGURE.appendChild(this._structure.IMAGE);

      this._structure.FIGURE.appendChild(this._structure.CAPTION);

      this._LITEBOX = this._structure.OUTER_WRAPPER;
    }
  }, {
    key: "_registerKeyboardEvents",
    value: function _registerKeyboardEvents() {
      var _this = this;

      if (!this.options.keyboardShortcuts) {
        return;
      }

      window.addEventListener('keydown', function (event) {
        if (_this._isHidden()) {
          return;
        }

        if (event.keyCode === 27) {
          _this._close();
        }

        if (event.keyCode === 39) {
          _this._next();
        }

        if (event.keyCode === 37) {
          _this._prev();
        }
      });
    }
  }, {
    key: "_registerTouchEvents",
    value: function _registerTouchEvents() {
      var _this2 = this;

      if (!this.options.touch) {
        return;
      }

      var xDown = null;
      var yDown = null;
      window.addEventListener('touchstart', function (event) {
        if (_this2._isHidden()) {
          return;
        }

        xDown = event.touches[0].clientX;
        yDown = event.touches[0].clientY;
      });
      window.addEventListener('touchmove', function (event) {
        if (_this2._isHidden() || !xDown || !yDown) {
          return;
        }

        var xUp = event.touches[0].clientX;
        var yUp = event.touches[0].clientY;

        if (Math.abs(xDown - xUp) > Math.abs(yDown - yUp)) {
          if (xDown - xUp > 0) {
            _this2._next();
          } else {
            _this2._prev();
          }
        } else {
          if (yDown - yUp < 0) {
            _this2._close();
          }
        }

        xDown = null;
        yDown = null;
      });
    }
  }, {
    key: "_registerMouseEvents",
    value: function _registerMouseEvents() {
      var _this3 = this;

      for (var gallery in this._collection) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          var _loop = function _loop() {
            var image = _step.value;
            image.addEventListener('click', function (event) {
              event.preventDefault();

              _this3._handleOpenLitebox(image);
            });
          };

          for (var _iterator = this._collection[gallery][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            _loop();
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      this._structure.BUTTON_CLOSE.addEventListener('click', this._close.bind(this));

      this._structure.BUTTON_NEXT.addEventListener('click', this._next.bind(this));

      this._structure.BUTTON_PREV.addEventListener('click', this._prev.bind(this));
    }
  }, {
    key: "_handleOpenLitebox",
    value: function _handleOpenLitebox(image) {
      if (!document.body.contains(this._LITEBOX)) {
        document.body.appendChild(this._LITEBOX);
      }

      if (this.options.animations) {
        this._animationCleanup('animate-in');
      }

      this._showLoader();

      this._handleImageChange(image);
    }
  }, {
    key: "_handleImageChange",
    value: function _handleImageChange(image) {
      var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var tmp = new Image();
      var self = this;
      tmp.src = image.getAttribute(this.options.target);

      tmp.onload = function () {
        var _this4 = this;

        if (self.options.animations && direction) {
          self._LITEBOX.classList.add("animate-to-".concat(direction === 'next' ? 'left' : 'right'));

          self._LITEBOX.addEventListener('animationend', function (event) {
            if (event.animationName === 'litebox-fade-out') {
              imageLoaded(_this4.src);

              self._LITEBOX.classList.remove("animate-to-".concat(direction === 'next' ? 'left' : 'right'));

              self._LITEBOX.classList.add("animate-from-".concat(direction === 'next' ? 'right' : 'left'));
            }

            if (event.animationName === 'litebox-fade-in') {
              self._LITEBOX.classList.remove("animate-from-".concat(direction === 'next' ? 'right' : 'left'));
            }
          });
        } else {
          imageLoaded(this.src);
        }
      };

      tmp.onerror = function () {
        self._current = null;

        self._hideLoader();

        self._toggleButtons();

        self._showError();
      };

      function imageLoaded(src) {
        self._structure.IMAGE.src = src;
        self._current = image;

        self._hideLoader();

        self._toggleCaption();

        self._toggleButtons();
      }
    }
  }, {
    key: "_close",
    value: function _close() {
      if (this.options.animations) {
        this._LITEBOX.classList.add('animate-out');

        var self = this;

        this._animationCleanup('animate-out', function () {
          self._removeLitebox();
        });
      } else {
        this._removeLitebox();
      }
    }
  }, {
    key: "_removeLitebox",
    value: function _removeLitebox() {
      document.body.removeChild(this._LITEBOX);
      this.current = null;

      this._applyAttributes();
    }
  }, {
    key: "_toggleCaption",
    value: function _toggleCaption() {
      var caption = this._current.getAttribute(this.options.caption);

      if (!caption) {
        this._structure.CAPTION.classList.add(this.options.classNames.hidden);
      } else {
        this._structure.CAPTION.textContent = caption;

        this._structure.CAPTION.classList.remove(this.options.classNames.hidden);
      }
    }
  }, {
    key: "_toggleButtons",
    value: function _toggleButtons() {
      this._structure.BUTTON_CLOSE.classList.remove(this.options.classNames.hidden);

      if (this._isInGallery()) {
        if (!this._isLast()) {
          this._structure.BUTTON_NEXT.classList.remove(this.options.classNames.hidden);
        } else {
          this._structure.BUTTON_NEXT.classList.add(this.options.classNames.hidden);
        }

        if (!this._isFirst()) {
          this._structure.BUTTON_PREV.classList.remove(this.options.classNames.hidden);
        } else {
          this._structure.BUTTON_PREV.classList.add(this.options.classNames.hidden);
        }
      }
    }
  }, {
    key: "_next",
    value: function _next() {
      if (this._getNext()) {
        this._handleImageChange(this._getNext(), 'next');
      }
    }
  }, {
    key: "_prev",
    value: function _prev() {
      if (this._getPrev()) {
        this._handleImageChange(this._getPrev(), 'prev');
      }
    }
  }, {
    key: "_isHidden",
    value: function _isHidden() {
      return !document.body.contains(this._LITEBOX);
    }
  }, {
    key: "_showLoader",
    value: function _showLoader() {
      this._structure.LOADER.classList.remove(this.options.classNames.hidden);
    }
  }, {
    key: "_hideLoader",
    value: function _hideLoader() {
      this._structure.LOADER.classList.add(this.options.classNames.hidden);
    }
  }, {
    key: "_showError",
    value: function _showError() {
      this._structure.ERROR.classList.remove(this.options.classNames.hidden);
    }
  }, {
    key: "_isInGallery",
    value: function _isInGallery() {
      for (var gallery in this._collection) {
        if (gallery !== '__' && this._collection[gallery].includes(this._current)) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "_isFirst",
    value: function _isFirst() {
      var gallery = this._collection[this._current.dataset.gallery.toUpperCase()];

      if (gallery.indexOf(this._current) === 0) {
        return true;
      }

      return false;
    }
  }, {
    key: "_isLast",
    value: function _isLast() {
      var gallery = this._collection[this._current.dataset.gallery.toUpperCase()];

      if (gallery.indexOf(this._current) === gallery.length - 1) {
        return true;
      }

      return false;
    }
  }, {
    key: "_getNext",
    value: function _getNext() {
      var gallery = this._collection[this._current.dataset.gallery.toUpperCase()];

      var i = gallery.indexOf(this._current);
      return gallery[i + 1];
    }
  }, {
    key: "_getPrev",
    value: function _getPrev() {
      var gallery = this._collection[this._current.dataset.gallery.toUpperCase()];

      var i = gallery.indexOf(this._current);
      return gallery[i - 1];
    }
  }, {
    key: "_buildCollection",
    value: function _buildCollection() {
      var images = document.querySelectorAll(this.options.el);
      var collection = {
        __: []
      };
      images.forEach(function (image) {
        var gallery = image.dataset.gallery;

        if (gallery) {
          if (!collection.hasOwnProperty(gallery.toUpperCase())) {
            collection[gallery.toUpperCase()] = [];
          }

          collection[gallery.toUpperCase()].push(image);
        } else {
          collection.__.push(image);
        }
      });
      this._collection = collection;
    }
  }, {
    key: "_animationCleanup",
    value: function _animationCleanup(name, cb) {
      if (!this.options.animations || !name) return;
      var wrapper = this._LITEBOX;

      this._LITEBOX.addEventListener('animationend', function () {
        wrapper.classList.remove(name);
        if (cb) cb();
      }, {
        once: true
      });
    }
  }], [{
    key: "_isObject",
    value: function _isObject(item) {
      return item && _typeof(item) === 'object' && !Array.isArray(item);
    }
  }, {
    key: "_merge",
    value: function _merge(target, source) {
      var output = Object.assign({}, target);
      Object.keys(source).forEach(function (key) {
        if (Litebox._isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, _defineProperty({}, key, source[key]));
          } else {
            output[key] = Litebox._merge(target[key], source[key]);
          }
        } else {
          Object.assign(output, _defineProperty({}, key, source[key]));
        }
      });
      return output;
    }
  }, {
    key: "defaults",
    get: function get() {
      return {
        el: '[data-litebox]',
        target: 'href',
        caption: 'title',
        keyboardShortcuts: true,
        touch: true,
        autohideControls: true,
        loop: false,
        animations: true,
        labels: {
          close: 'Close',
          next: 'Show next image',
          prev: 'Show previous image',
          error: 'Sorry, the image couldn\'t be loaded.'
        },
        classNames: {
          outer: 'litebox',
          inner: 'litebox-wrapper',
          figure: 'litebox-image-wrapper',
          caption: 'litebox-caption',
          image: 'litebox-image',
          buttonGeneral: 'litebox-button',
          buttonClose: 'litebox-button-close',
          buttonPrev: 'litebox-button-prev',
          buttonNext: 'litebox-button-next',
          loader: 'litebox-loader',
          error: 'litebox-error',
          hidden: 'is-hidden'
        }
      };
    }
  }]);

  return Litebox;
}();

new Litebox();