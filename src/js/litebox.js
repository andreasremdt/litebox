/**
 * Litebox
 * 
 * Copyright (c) 2018 by Andreas Remdt
 */
class Litebox {
  constructor(options) {
    // Assign options
    this.options = Object.assign(Litebox.defaults, options);

    // Get all images
    this.elements = document.querySelectorAll(this.options.el);

    this._current = null;


    this.init();
  }


  init() {
    this.createElements();
    this.build();
    this.registerClickEvents();
    this.registerTouchEvents();
    this.registerKeyboardEvents();
  }



  /**
   * Creates all the needed HTML elements for the litebox and registers them
   * globally for access.
   */
  createElements() {
    this._close = document.createElement('button');       // Button that closes the litebox on click
    this._next = document.createElement('button');        // Button that displays the next image on click
    this._prev = document.createElement('button');        // Button that displays the previous image on click
    this._outer = document.createElement('div');          // The outer wrapper of the litebox
    this._inner = document.createElement('div');          // The inner, centered wrapper of the litebox
    this._figure = document.createElement('figure');      // The figure that contains the image element
    this._caption = document.createElement('ficaption');  // The image caption below the image
    this._image = new Image();                            // The actual image
  }

  

  /**
   * Retrive the default options of Litebox, such as selectors
   * or animation attributes.
   * 
   * @return {Object} The default options
   */
  static get defaults() {
    return {
      el: '[data-litebox]',
      target: 'href',
      caption: 'title',
      gallery: true,
      keyboardShortcuts: true,
      touch: true,
      labels: {
        close: 'Close Litebox',
        next: 'Next image',
        prev: 'Previous image'
      },
      classNames: {
        outer: 'litebox-outer',
        inner: 'litebox-inner',
        figure: 'litebox-image-wrapper',
        caption: 'litebox-image-caption',
        image: 'litebox-image',
        close: 'litebox-button litebox-button-close',
        prev: 'litebox-button litebox-button-prev',
        next: 'litebox-button litebox-button-next'
      }
    }
  }



  /**
   * If the users has enabled keyboard events, this method registers
   * all keys (ESC, left, right) and binds them to their appropriate function.
   */
  registerKeyboardEvents() {
    // If keyboard events are disabled, don't do anything
    if (!this.options.keyboardShortcuts) {
      return;
    }

    window.addEventListener('keydown', (event) => {
      // If no litebox is present in the DOM, don't do anything
      if (this.isHidden()) {
        return;
      }

      // ESC key is pressed, close litebox
      if (event.keyCode === 27) {
        this.close();
      }

      // Right arrow is pressed and gallery is enabled -> display next image
      if (event.keyCode === 39 && this.options.gallery) {
        this.next();
      }

      // Left arrow is pressed and gallery is enabled -> display previous image
      if (event.keyCode === 37 && this.options.gallery) {
        this.prev();
      }
    });
  }



  /**
   * If the users has enabled touch events, this method registers
   * three touch gestures: swipe left, swipe right and swipe down (closing the litebox).
   */
  registerTouchEvents() {
    // If touch is disabled, don't do anything
    if (!this.options.touch) {
      return;
    }

    // Initialize touch coordinates
    let xDown = null,
        yDown = null;

    // Captures the coordinates of the finger on touchstart.
    window.addEventListener('touchstart', (event) => {
      if (this.isHidden()) {
        return;
      }

      xDown = event.touches[0].clientX;
      yDown = event.touches[0].clientY;
    });

    // On touchmove, calculate the direction and execute the appropriate function
    window.addEventListener('touchmove', (event) => {
      // If there is no litebox in the DOM, cancel
      if (this.isHidden() || !xDown || !yDown) {
        return;
      }

      let xUp = event.touches[0].clientX,
          yUp = event.touches[0].clientY;

      if (Math.abs(xDown - xUp) > Math.abs(yDown - yUp)) {
        if ((xDown - xUp) > 0) {
          this.next();
        } else {
          this.prev();
        }
      } else {
        if ((yDown - yUp) < 0) {
          this.close();
        }
      }

      // Reset the coordinates
      xDown = null;
      yDown = null;
    });
  }


  isHidden() {
    return this._outer.classList.contains('-hidden');
  }



  /**
   * Registers all click events 
   */
  registerClickEvents() {
    this.elements.forEach((image) => {
      image.addEventListener('click', (event) => {
        this.handleImageChange(image);

        event.preventDefault();
      });
    });
  
    this._next.addEventListener('click', this.next.bind(this));
    this._prev.addEventListener('click', this.prev.bind(this));
    this._close.addEventListener('click', this.close.bind(this));
    this._inner.addEventListener('mouseenter', this.showControls.bind(this));
    this._inner.addEventListener('mouseleave', this.hideControls.bind(this));
    this._inner.addEventListener('mousemove', this.clearTimeout.bind(this));
  }



  handleImageChange(image) {
    this._current = Array.from(this.elements).indexOf(image);

    this.refresh(image).then(() => {
      if (document.body.contains(this._outer)) {
        this._outer.className = `${this.options.classNames.outer} -fade-in -inactive`;
      } else {
        document.body.appendChild(this._outer);
      }

      setTimeout(() => {
        this._outer.classList.remove('-fade-in');
      }, 800);
    });
  }







  close(evt) {
    this._outer.classList.add('-fade-out');

    setTimeout(() => {
      this._outer.classList.add('-hidden');
    }, 800);
  }


  /**
   * Displays the next image in the gallery. If there is no more
   * image, it returns the function.
   */
  next() {
    // If there is no next image, don't do anything
    if (this._current === this.elements.length - 1) {
      return;
    }

    // Animate the image out
    this._outer.classList.add('-hide-image-left');

    // When the image has disappeared through animation, continue
    // loading the next one
    this._outer.addEventListener('animationend', (evt) => {

      this._current++;

      this.refresh(this.elements[this._current]).then(() => {
        this._outer.classList.remove('-hide-image-left');
        this._outer.classList.add('-show-image-right');

        this._outer.addEventListener('animationend', (evt) => {
          if (evt.animationName === 'show-image-right') {
            this._outer.classList.remove('-show-image-right');
          }
        });
      });
    }, { once: true });
  }



  /**
   * Displays the previous image in the gallery. If there is no
   * previous image, return the function.
   */
  prev() {
    // If there is no previous image, don't do anything
    if (this._current <= 0) {
      return;
    }

    // Animate the image out
    this._outer.classList.add('-hide-image-right');

    // When the image has disappeared through animation, continue
    // loading the next one
    this._outer.addEventListener('animationend', (evt) => {
      this._current--;

      this.refresh(this.elements[this._current]).then(() => {
        this._outer.classList.remove('-hide-image-right');
        this._outer.classList.add('-show-image-left');

        this._outer.addEventListener('animationend', (evt) => {
          if (evt.animationName === 'show-image-left') {
            this._outer.classList.remove('-show-image-left');
          }
        });
      });
    }, { once: true });
  }











  refresh(image) {
    const target = image.getAttribute(this.options.target),
          caption = image.getAttribute(this.options.caption);
    
    if (!target) {
      return;
    }

    if (!caption) {
      this._caption.classList.add('-hidden');
    } else {
      this._caption.textContent = caption;
      this._caption.classList.remove('-hidden');
    }

    return new Promise((resolve, undefined) => {
      this._image.src = target;
      this._image.alt = caption;
      this._image.onload = resolve;
    });
  }






  /**
   * Removes the `-inactive` class from the litebox wrapper
   * in order to show the controls. After 500 ms the controls are
   * automatically hidden.
   */
  showControls() {
    this._outer.classList.remove('-inactive');

    this.timeout = setTimeout(() => {
      this.hideControls();
    }, 500);
  }
  

  /**
   * After 1s, adds the `-inactice` class to the litebox wrapper
   * in order to hide the controls.
   */
  hideControls() {
    this._outer.classList.add('-inactive');
  }


  /**
   * Clears the global timeout that automatically hides the controls
   * after a short time without mouse movement.
   */
  clearTimeout() {
    clearTimeout(this.timeout);

    this.showControls();
  }


  /**
   * Creates the HTML for the entire litebox and returns it.
   * 
   * @returns {HTMLElement} The complete litebox.
   */
  build() {
    this._outer.className   = `${this.options.classNames.outer} -fade-in -inactive`;
    this._inner.className   = this.options.classNames.inner;
    this._close.className   = 'litebox-button litebox-button-close';
    this._close.title       = this.options.labels.close;
    this._next.className    = 'litebox-button litebox-button-next';
    this._next.title        = this.options.labels.next;
    this._prev.className    = 'litebox-button litebox-button-prev';
    this._prev.title        = this.options.labels.prev;
    this._figure.className  = this.options.classNames.figure;
    this._caption.className = this.options.classNames.caption;
    this._image.className   = this.options.classNames.image;
    
    this._outer.appendChild(this._inner);
    this._inner.appendChild(this._close);
    this._inner.appendChild(this._next);
    this._inner.appendChild(this._prev);
    this._inner.appendChild(this._figure);
    this._figure.appendChild(this._image);
    this._figure.appendChild(this._caption);
  }
}