/**
 * Litebox
 * 
 * Copyright (c) 2018 by Andreas Remdt
 */

class Litebox {
  constructor(options) {
    // Assign options and throw an error if the given object is invalid
    if (!Litebox._isObject(options)) {
      this.options = Litebox.defaults;
    } else {
      this.options = Litebox._merge(Litebox.defaults, options);
    }

    // The current displayed image. Litebox keeps track of
    // this for the gallery feature.
    this._current = null;

    // Current version
    this.VERSION = '0.8.2';

    // Start litebox
    this._init();
  }



  /**
   * Initializes the creation of each DOM element and
   * registers all available events.
   */
  _init() {
    this._buildCollection();

    // Step 1: Build & prepare HTML elements
    this._createElements();
    this._applyAttributes();
    this._createStructure();

    // Step 2: Apply interaction with event listeners
    this._registerKeyboardEvents();
    this._registerMouseEvents();
    this._registerTouchEvents();
  }



  /**
   * Creates all the needed HTML elements for Litebox and registers them
   * globally in the object for later access.
   */
  _createElements() {
    this._structure = {
      'BUTTON_CLOSE':   document.createElement('button'),
      'BUTTON_NEXT':    document.createElement('button'),
      'BUTTON_PREV':    document.createElement('button'),
      'OUTER_WRAPPER':  document.createElement('div'),
      'INNER_WRAPPER':  document.createElement('div'),
      'FIGURE':         document.createElement('figure'),
      'CAPTION':        document.createElement('figcaption'),
      'IMAGE':          document.createElement('img'),
      'LOADER':         document.createElement('div'),
      'ERROR':          document.createElement('div')
    };
  }



  /**
   * Applies the necessary attributes to each HTML element,
   * such as class name and title.
   */
  _applyAttributes() {
    this._structure.OUTER_WRAPPER.className = `${this.options.classNames.outer}${this.options.animations ? ' is-animated animate-in' : ''}`;
    this._structure.INNER_WRAPPER.className = this.options.classNames.inner;
    this._structure.BUTTON_CLOSE.className = `${this.options.classNames.buttonGeneral} ${this.options.classNames.buttonClose} ${this.options.classNames.hidden}`;
    this._structure.BUTTON_CLOSE.textContent = this.options.labels.close;
    this._structure.BUTTON_NEXT.className = `${this.options.classNames.buttonGeneral} ${this.options.classNames.buttonNext} ${this.options.classNames.hidden}`;
    this._structure.BUTTON_NEXT.textContent = this.options.labels.next;
    this._structure.BUTTON_PREV.className = `${this.options.classNames.buttonGeneral} ${this.options.classNames.buttonPrev} ${this.options.classNames.hidden}`;
    this._structure.BUTTON_PREV.textContent = this.options.labels.prev;
    this._structure.FIGURE.className = this.options.classNames.figure;
    this._structure.CAPTION.className = `${this.options.classNames.caption} ${this.options.classNames.hidden}`;
    this._structure.IMAGE.className = `${this.options.classNames.image} ${this.options.classNames.hidden}`;
    this._structure.LOADER.className = `${this.options.classNames.loader} ${this.options.classNames.hidden}`;
    this._structure.ERROR.className = `${this.options.classNames.error} ${this.options.classNames.hidden}`;
    this._structure.ERROR.textContent = this.options.labels.error;
  }



  /**
   * Builds the entire DOM structure of litebox and appends
   * the classes to each element.
   */
  _createStructure() {
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

  

  /**
   * If the users has enabled keyboard events, this method registers
   * all keys (ESC, left, right) and binds them to their appropriate function.
   */
  _registerKeyboardEvents() {
    // If keyboard events are disabled, don't do anything
    if (!this.options.keyboardShortcuts) {
      return;
    }
    
    window.addEventListener('keydown', (event) => {
      // If no litebox is present in the DOM, don't do anything
      if (this._isHidden()) {
        return;
      }

      // ESC key is pressed, close litebox
      if (event.keyCode === 27) {
        this._close();
      }

      // Right arrow is pressed and gallery is enabled -> display next image
      if (event.keyCode === 39) {
        this._next();
      }

      // Left arrow is pressed and gallery is enabled -> display previous image
      if (event.keyCode === 37) {
        this._prev();
      }
    });
  }



  /**
   * If the users has enabled touch events, this method registers
   * three touch gestures: swipe left, swipe right and swipe down (closing the litebox).
   */
  _registerTouchEvents() {
    // If touch is disabled, don't do anything
    if (!this.options.touch) {
      return;
    }

    // Initialize touch coordinates
    var xDown = null;
    var yDown = null;

    // Captures the coordinates of the finger on touchstart.
    window.addEventListener('touchstart', (event) => {
      if (this._isHidden()) {
        return;
      }

      xDown = event.touches[0].clientX;
      yDown = event.touches[0].clientY;
    });

    // On touchmove, calculate the direction and execute the appropriate function
    window.addEventListener('touchmove', (event) => {
      // If there is no litebox in the DOM, cancel
      if (this._isHidden() || !xDown || !yDown) {
        return;
      }

      var xUp = event.touches[0].clientX;
      var yUp = event.touches[0].clientY;

      if (Math.abs(xDown - xUp) > Math.abs(yDown - yUp)) {
        if ((xDown - xUp) > 0) {
          this._next();
        } else {
          this._prev();
        }
      } else {
        if ((yDown - yUp) < 0) {
          this._close();
        }
      }

      // Reset the coordinates
      xDown = null;
      yDown = null;
    });
  }


  
  /**
   * Registers all mouse events.
   */
  _registerMouseEvents() {
    // Adds an event listener to every image found
    for (let gallery in this._collection) {
      for (let image of this._collection[gallery]) {
        image.addEventListener('click', (event) => {
          event.preventDefault();

          this._handleOpenLitebox(image);
        });
      }
    }

    this._structure.BUTTON_CLOSE.addEventListener('click', this._close.bind(this));
    this._structure.BUTTON_NEXT.addEventListener('click', this._next.bind(this));
    this._structure.BUTTON_PREV.addEventListener('click', this._prev.bind(this));
  }




  _handleOpenLitebox(image) {
    if (!document.body.contains(this._LITEBOX)) {
      document.body.appendChild(this._LITEBOX);
    }

    if (this.options.animations) {
      this._animationCleanup('animate-in');
    }

    this._showLoader();
    this._handleImageChange(image);
  }





  _handleImageChange(image, direction = null) {
    var tmp = new Image();
    var self = this;
    
    tmp.src = image.getAttribute(this.options.target);
    
    tmp.onload = function() {
      if (self.options.animations && direction) {
        self._LITEBOX.classList.add(`animate-to-${direction === 'next' ? 'left' : 'right'}`);

        self._LITEBOX.addEventListener('animationend', (event) => {
          if (event.animationName === 'litebox-fade-out') {
            imageLoaded(this.src);

            self._LITEBOX.classList.remove(`animate-to-${direction === 'next' ? 'left' : 'right'}`);
            self._LITEBOX.classList.add(`animate-from-${direction === 'next' ? 'right' : 'left'}`);
          }

          if (event.animationName === 'litebox-fade-in') {
            self._LITEBOX.classList.remove(`animate-from-${direction === 'next' ? 'right' : 'left'}`);
          }
        });
      } else {
        imageLoaded(this.src);
      }
    };

    tmp.onerror = function() {
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
  

    

  
  /**
   * Calls a function to remove Litebox from the DOM once the
   * fade-out animation has finished (if activated).
   */
  _close() {
    if (this.options.animations) {
      this._LITEBOX.classList.add('animate-out');

      var self = this;

      this._animationCleanup('animate-out', function() {
        self._removeLitebox();
      });
    } else {
      this._removeLitebox();
    }
  }

  /**
   * Removes the Litebox wrapper from the DOM and resets
   * the internal structure and current element. Also removes the event
   * listener to improve memory usage.
   */
  _removeLitebox() {
    document.body.removeChild(this._LITEBOX);

    this.current = null;
    this._applyAttributes();
  }




  /**
   * Either shows or hides the caption, depending on
   * whether there is a text or not.
   */
  _toggleCaption() {
    var caption = this._current.getAttribute(this.options.caption);

    if (!caption) {
      this._structure.CAPTION.classList.add(this.options.classNames.hidden);
    } else {
      this._structure.CAPTION.textContent = caption;
      this._structure.CAPTION.classList.remove(this.options.classNames.hidden);
    }
  }



  /**
   * Either displays or hides the next/prev button,
   * depending on whether there is a next/previous image.
   */
  _toggleButtons() {
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



  /**
   * Displays the next image in the gallery. If there is no more
   * image, it returns the function.
   */
  _next() {
    if (this._getNext()) {
      this._handleImageChange(this._getNext(), 'next');
    }
  }



  /**
   * Displays the previous image in the gallery. If there is no
   * previous image, return the function.
   */
  _prev() {
    if (this._getPrev()) {
      this._handleImageChange(this._getPrev(), 'prev');
    }
  }



  /**
   * Returns true if litebox is not currently active.
   * 
   * @returns {Boolean}
   */
  _isHidden() {
    return !document.body.contains(this._LITEBOX);
  }



  /**
  * Shows the loader while an image is loading.
  */
  _showLoader() {
    this._structure.LOADER.classList.remove(this.options.classNames.hidden);
  }



  /**
   * Hides the loader after an image has been loaded.
   */
  _hideLoader() {
    this._structure.LOADER.classList.add(this.options.classNames.hidden);
  }



  /**
   * In case an image could not be loaded, shows an error message.
   */
  _showError() {
    this._structure.ERROR.classList.remove(this.options.classNames.hidden);
  }



  /**
   * Returns true if the current image is part of a gallery.
   * 
   * @returns {Boolean}
   */
  _isInGallery() {
    for (let gallery in this._collection) {
      if (gallery !== '__' && this._collection[gallery].includes(this._current)) {
        return true;
      }
    }

    return false;
  }



  /**
   * Returns true if the current image is the first one in the gallery.
   * 
   * @returns {Boolean}
   */
  _isFirst() {
    var gallery = this._collection[this._current.dataset.gallery.toUpperCase()];

    if (gallery.indexOf(this._current) === 0) {
      return true;
    }

    return false;
  }



  /**
   * Returns true if the current image is the last one in the gallery.
   * 
   * @returns {Boolean}
   */
  _isLast() {
    var gallery = this._collection[this._current.dataset.gallery.toUpperCase()];

    if (gallery.indexOf(this._current) === gallery.length - 1) {
      return true;
    }

    return false;
  }


  _getNext() {
    var gallery = this._collection[this._current.dataset.gallery.toUpperCase()];
    var i = gallery.indexOf(this._current);

    return gallery[i + 1];
  }

  _getPrev() {
    var gallery = this._collection[this._current.dataset.gallery.toUpperCase()];
    var i = gallery.indexOf(this._current);

    return gallery[i - 1];
  }
  


  /**
   * Separates images based on their gallery attribute. All images
   * are categorized and a collection with the galleries and their
   * associated images is built.
   * 
   * @returns {Object} The built collection.
   */
  _buildCollection() {
    var images = document.querySelectorAll(this.options.el);
    var collection = { __: [] };

    images.forEach(function(image) {
      var gallery = image.dataset.gallery;

      // If an image has the `gallery` attribute, add it to the
      // collection object.
      if (gallery) {
        if (!collection.hasOwnProperty(gallery.toUpperCase())) {
          collection[gallery.toUpperCase()] = [];
        }

        collection[gallery.toUpperCase()].push(image);
      } else {
        // If there is no `gallery` attribute, push the images into
        // the default array.
        collection.__.push(image);
      }
    });

    this._collection = collection;
  }



  _animationCleanup(name, cb) {
    if (!this.options.animations || !name) return;

    var wrapper = this._LITEBOX;

    this._LITEBOX.addEventListener('animationend', function() {
      wrapper.classList.remove(name);

      if (cb) cb();
    }, { once: true });
  }



  /**
   * Checks if a given item is an object.
   * 
   * @param {Object} item The object to check
   * @returns {Boolean}
   */
  static _isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }



  /**
   * Deep merges two objectes.
   *  
   * @param {Object} target The target object to merge in
   * @param {Object} source The source object to merge from
   * @returns {Object} The newly merged object
   */
  static _merge(target, source) {
    let output = Object.assign({}, target);

    Object.keys(source).forEach((key) => {
      if (Litebox._isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = Litebox._merge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });

    return output;
  }

  /**
   * Retrieve the default options of Litebox, such as selectors
   * or animation attributes.
   * 
   * @return {Object} The default options
   */
  static get defaults() {
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
}

new Litebox();