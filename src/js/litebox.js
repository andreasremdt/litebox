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
    this.VERSION = '0.8.4';

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
    this._reset();
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
   * Builds the entire DOM structure of litebox and appends
   * the classes to each element.
   */
  _createStructure() {
    this._structure.OUTER_WRAPPER.appendChild(this._structure.INNER_WRAPPER);
    this._structure.OUTER_WRAPPER.appendChild(this._structure.LOADER);
    this._structure.INNER_WRAPPER.appendChild(this._structure.BUTTON_CLOSE);
    this._structure.INNER_WRAPPER.appendChild(this._structure.BUTTON_NEXT);
    this._structure.INNER_WRAPPER.appendChild(this._structure.BUTTON_PREV);
    this._structure.INNER_WRAPPER.appendChild(this._structure.FIGURE);
    this._structure.INNER_WRAPPER.appendChild(this._structure.ERROR);
    this._structure.FIGURE.appendChild(this._structure.IMAGE);
    this._structure.FIGURE.appendChild(this._structure.CAPTION);

    this._LITEBOX = this._structure.OUTER_WRAPPER;
  }



  /**
   * Applies the necessary attributes to each HTML element,
   * such as class name and title.
   */
  _reset() {
    this._structure.OUTER_WRAPPER.className = `${this.options.classNames.outer}${this.options.animation ? ' is-animated' : ''}`;
    this._structure.INNER_WRAPPER.className = `${this.options.classNames.inner} ${this.options.classNames.hidden}`;
    this._structure.BUTTON_CLOSE.className = `${this.options.classNames.buttonGeneral} ${this.options.classNames.buttonClose} ${this.options.classNames.hidden}`;
    this._structure.BUTTON_CLOSE.textContent = this.options.labels.close;
    this._structure.BUTTON_NEXT.className = `${this.options.classNames.buttonGeneral} ${this.options.classNames.buttonNext} ${this.options.classNames.hidden}`;
    this._structure.BUTTON_NEXT.textContent = this.options.labels.next;
    this._structure.BUTTON_PREV.className = `${this.options.classNames.buttonGeneral} ${this.options.classNames.buttonPrev} ${this.options.classNames.hidden}`;
    this._structure.BUTTON_PREV.textContent = this.options.labels.prev;
    this._structure.FIGURE.className = this.options.classNames.figure;
    this._structure.CAPTION.className = `${this.options.classNames.caption} ${this.options.classNames.hidden}`;
    this._structure.IMAGE.className = `${this.options.classNames.image}`;
    this._structure.IMAGE.src = '';
    this._structure.LOADER.className = `${this.options.classNames.loader} ${this.options.classNames.hidden}`;
    this._structure.ERROR.className = `${this.options.classNames.error} ${this.options.classNames.hidden}`;
    this._structure.ERROR.textContent = this.options.labels.error;
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
        this.remove();
      }

      // Right arrow is pressed and gallery is enabled -> display next image
      if (event.keyCode === 39) {
        this.switch('next');
      }

      // Left arrow is pressed and gallery is enabled -> display previous image
      if (event.keyCode === 37) {
        this.switch('prev');
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
          this.switch('next');
        } else {
          this.switch('prev');
        }
      } else {
        if ((yDown - yUp) < 0) {
          this.remove();
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
      for (let item in this._collection[gallery]) {
        let image = this._collection[gallery][item];
        
        image.addEventListener('click', (event) => {
          event.preventDefault();

          this.open(image);
        });
      }
    }

    this._structure.BUTTON_CLOSE.addEventListener('click', this.remove.bind(this));
    this._structure.BUTTON_NEXT.addEventListener('click', () => this.switch('next'));
    this._structure.BUTTON_PREV.addEventListener('click', () => this.switch('prev'));
  }



  open(element) {
    if (document.body.contains(this._LITEBOX)) {
      return;
    }
    
    document.body.appendChild(this._LITEBOX);

    this._animate('before-load', null, this.options.animation);
    this._showLoader();
    this._beforeLoad(element[this.options.target], () => {
      this._afterLoad(element);
    });
  }

  remove() {
    if (!document.body.contains(this._LITEBOX)) {
      return;
    }

    this._animate('before-unload', () => {
      document.body.removeChild(this._LITEBOX);
      
      this._current = null;
      this._reset();
    }, this.options.animation);
  }


  switch(direction) {
    var target = this.exists(direction);

    if (target) {
      this._showLoader();
      this._beforeLoad(target[this.options.target], () => {
        this._animate(`before-${direction}`, () => {
          this._afterLoad(target);
          this._animate(`after-${direction}`, null, this.options.animation);
        }, this.options.animation);
      });
    }
  }

  _beforeLoad(src, cb) {
    var image = new Image();

    image.src = src;
    image.onload = cb;
    image.onerror = () => {
      cb();

      this._showError();
    };
  }

  _afterLoad(element) {
    this._structure.IMAGE.src = element[this.options.target];
    this._structure.INNER_WRAPPER.classList.remove('is-hidden');
    this._current = element;

    this._hideError();
    this._hideLoader();
    this._toggleCaption();
    this._toggleButtons();
  }
  


  _animate(className, cb, time) {
    if (this.options.animation && this.options.animation > 0) {
      this._LITEBOX.classList.add(className);
      
      setTimeout(() => {
        if (cb) cb();

        this._LITEBOX.classList.remove(className);
      }, time);
    } else {
      if (cb) cb();
    }
  }


  exists(direction) {
    if (!this._current || !this._isInGallery()) return false;

    var gallery = this._collection[this._current.dataset.gallery.toUpperCase()];
    var i = gallery.indexOf(this._current);

    if (direction === 'next') {
      if (this.options.loop && (i + 1) === gallery.length) {
        return gallery[0];
      }

      return gallery[i + 1] || false;
    } else if (direction === 'prev') {
      if (this.options.loop && i === 0) {
        return gallery[gallery.length - 1];
      }

      return gallery[i - 1] || false;
    }
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
      if (this._isLast() && !this.options.loop) {
        this._structure.BUTTON_NEXT.classList.add(this.options.classNames.hidden);
      } else {
        this._structure.BUTTON_NEXT.classList.remove(this.options.classNames.hidden);
      }

      if (this._isFirst() && !this.options.loop) {
        this._structure.BUTTON_PREV.classList.add(this.options.classNames.hidden);
      } else {
        this._structure.BUTTON_PREV.classList.remove(this.options.classNames.hidden);
      }
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

  _hideError() {
    this._structure.ERROR.classList.add(this.options.classNames.hidden);
  }



  /**
   * Returns true if the current image is part of a gallery.
   * 
   * @returns {Boolean}
   */
  _isInGallery() {
    for (let gallery in this._collection) {
      if (gallery !== '__' && this._collection[gallery].indexOf(this._current) !== -1) {
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
    
    [].forEach.call(images, image => {
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
      slideshow: 5000,
      loop: false,
      animation: 500,
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