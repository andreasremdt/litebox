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

    this.litebox = null;
    this.image = null;
    this.timeout = null;
    this.index = 0;

    this.registerClickEvents();
    this.registerTouchEvents();
    this.registerKeyboardEvents();
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
      if (!this.litebox) {
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
      if (!this.litebox) {
        return;
      }

      xDown = event.touches[0].clientX;
      yDown = event.touches[0].clientY;
    });

    // On touchmove, calculate the direction and execute the appropriate function
    window.addEventListener('touchmove', (event) => {

      // If there is no litebox in the DOM, cancel
      if (!this.litebox || !xDown || !yDown) {
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



  /**
   * 
   */
  registerClickEvents() {
    this.elements.forEach((image) => {
      image.addEventListener('click', (event) => {
        this.index = Array.from(this.elements).indexOf(image);
        this.prepare(image);
        
        event.preventDefault();
      });
    });
  }

  registerHandlers(close, next, prev, inner) {
    if (this.options.gallery) {
      next.addEventListener('click', this.next.bind(this));
      prev.addEventListener('click', this.prev.bind(this));
    }

    close.addEventListener('click', this.close.bind(this));
    inner.addEventListener('mouseenter', this.showControls.bind(this));
    inner.addEventListener('mouseleave', this.hideControls.bind(this));
    inner.addEventListener('mousemove', this.clearTimeout.bind(this));
  }


  toggleElementVisibility(element) {

  }


  close(evt) {
    this.litebox.classList.add('-fade-out');
    //this.timeout = null;

    setTimeout(() => {
      document.body.removeChild(this.litebox);
      this.litebox = null;
      this.figure = null;
      this.index = 0;
    }, 800);
  }


  /**
   * Displays the next image in the gallery. If there is no more
   * image, it returns the function.
   */
  next() {
    // If there is no next image, don't do anything
    if (this.index === this.elements.length - 1) {
      return;
    }

    // Animate the image out
    this.litebox.classList.add('-hide-image-left');

    // When the image has disappeared through animation, continue
    // loading the next one
    this.litebox.addEventListener('animationend', (evt) => {
      this.index++;

      this.replaceImage(this.elements[this.index]).then(() => {
        this.litebox.classList.remove('-hide-image-left');
        this.litebox.classList.add('-show-image-right');

        this.litebox.addEventListener('animationend', (evt) => {
          if (evt.animationName === 'show-image-right') {
            this.litebox.classList.remove('-show-image-right');
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
    if (this.index <= 0) {
      return;
    }

    // Animate the image out
    this.litebox.classList.add('-hide-image-right');

    // When the image has disappeared through animation, continue
    // loading the next one
    this.litebox.addEventListener('animationend', (evt) => {
      this.index--;

      this.replaceImage(this.elements[this.index]).then(() => {
        this.litebox.classList.remove('-hide-image-right');
        this.litebox.classList.add('-show-image-left');

        this.litebox.addEventListener('animationend', (evt) => {
          if (evt.animationName === 'show-image-left') {
            this.litebox.classList.remove('-show-image-left');
          }
        });
      });
    }, { once: true });
  }






  replaceImage(image) {
    return new Promise((resolve, undefined) => {
      const caption = image.getAttribute(this.options.caption);

      this.image.src = image.getAttribute(this.options.target);
      this.image.alt = image.getAttribute(this.options.caption);

      if (caption) {
        this.image.nextElementSibling.textContent = caption;
        this.image.nextElementSibling.removeAttribute('hidden');
      } else {
        this.image.nextElementSibling.setAttribute('hidden', true);
      }

      this.image.onload = resolve;
    });
  }



  prepare(image) {
    // Get the image to load based on the attribute
    const target = image.getAttribute(this.options.target);
    const caption = image.getAttribute(this.options.caption);

    // If the target is empty or null, don't do anything
    if (!target) {
      return;
    }

    this.litebox = document.body.appendChild(this.createHTML(target, caption));

    // Removes the fade-in class after the litebox has been displayed.
    this.litebox.firstElementChild.addEventListener('animationend', (evt) => {
      this.litebox.classList.remove('-fade-in');
    }, { once: true });
  }


  /**
   * Removes the `-inactive` class from the litebox wrapper
   * in order to show the controls. After 500 ms the controls are
   * automatically hidden.
   */
  showControls() {
    this.litebox.classList.remove('-inactive');

    this.timeout = setTimeout(() => {
      this.hideControls();
    }, 500);
  }
  

  /**
   * After 1s, adds the `-inactice` class to the litebox wrapper
   * in order to hide the controls.
   */
  hideControls() {
    this.litebox.classList.add('-inactive');
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
   * @param {String} source The link of the image to be loaded.
   * @param {String} text The caption of the image to be displayed.
   * @returns {HTMLElement} The complete litebox.
   */
  createHTML(source, text) {
    // Litebox outer wrapper
    const outer = document.createElement('div');
    outer.classList.add('litebox-outer', '-fade-in', '-inactive');

    // Litebox inner wrapper
    const inner = document.createElement('div');
    inner.classList.add('litebox-inner');

    // Button for closing the litebox
    const close = document.createElement('button');
    close.type = 'button';
    close.title = 'Close';
    close.classList.add('litebox-button-close', 'litebox-button');

    let next, prev;

    if (this.options.gallery) {
      // Button for displaying the next image
      next = document.createElement('button');
      next.type = 'button';
      next.title = 'Next';
      next.classList.add('litebox-button-next', 'litebox-button');
  
      // Button for displaying the previous image
      prev = document.createElement('button');
      prev.type = 'button';
      prev.title = 'Prev';
      prev.classList.add('litebox-button-prev', 'litebox-button');

      inner.appendChild(next);
      inner.appendChild(prev);
    }

    // The actual image
    const image = new Image();
    image.src = source;
    image.alt = text;
    image.classList.add('litebox-image');

    // The figure element that contains the image and caption
    const figure = document.createElement('figure');
    figure.classList.add('litebox-image-wrapper');
    figure.appendChild(image);

    // The image caption
    const caption = document.createElement('figcaption');
    caption.classList.add('litebox-image-caption');
    caption.textContent = text || '';

    if (!text) {
      caption.classList.add('-hidden');
    }

    figure.appendChild(caption);

    // Build the DOM structure
    outer.appendChild(inner);
    inner.appendChild(close);
    inner.appendChild(figure);

    // Register event listeners and their handlers
    this.registerHandlers(close, next, prev, inner);
    this.image = image;

    // Return the wrapper and all buttons
    return outer;
  }
}