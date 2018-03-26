'use strict';

/**
 * Litebox
 * 
 * Copyright (c) 2018 by Andreas Remdt
 */
class Litebox {
  constructor(options) {
    this.defaults = {
      selector: {
        el: '[data-litebox]',
        target: 'href',
        caption: 'title'
      },
      animations: {
        fadeIn: 800,
        fadeOut: 800
      },
      labels: {
        close: 'Close',
        next: 'Next image',
        prev: 'Prev image'
      }
    };

    this.images = document.querySelectorAll(this.defaults.selector.el);
    this.litebox = null;
    this.image = null;
    this.index = 0;

    this.registerEvents();
  }

  registerEvents() {
    this.images.forEach((image) => {
      image.addEventListener('click', (evt) => {
        this.index = Array.from(this.images).indexOf(image);
        this.prepare(evt, image);
      });
    });

    // Register ESC and arrow keys for navigation
    window.addEventListener('keydown', (evt) => {

      // If there is no litebox displayed, don't do anything
      if (!this.litebox) {
        return;
      }

      switch(evt.keyCode) {
        case 27: // ESC
          this.close();
          break;
        case 39: // Arrow right
          this.next();
          break;
        case 37: // Arrow left
          this.prev();
      }
    });
  }

  registerHandlers(close, next, prev) {
    next.addEventListener('click', this.next.bind(this));
    prev.addEventListener('click', this.prev.bind(this));
    close.addEventListener('click', this.close.bind(this));
  }

  close(evt) {
    this.litebox.classList.add('-fade-out');

    setTimeout(() => {
      document.body.removeChild(this.litebox);
      this.litebox = null;
      this.figure = null;
      this.index = 0;
    }, this.defaults.animations.fadeOut);
  }


  /**
   * Displays the next image in the gallery. If there is no more
   * image, it returns the function.
   */
  next() {
    // If there is no next image, don't do anything
    if (this.index === this.images.length - 1) {
      return;
    }

    // Animate the image out
    this.litebox.classList.add('-hide-image-left');

    // When the image has disappeared through animation, continue
    // loading the next one
    this.litebox.addEventListener('animationend', (evt) => {
      this.index++;

      this.replaceImage(this.images[this.index]).then(() => {
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
      
      this.replaceImage(this.images[this.index]).then(() => {
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
      this.image.src = image.getAttribute(this.defaults.selector.target);
      this.image.alt = image.getAttribute(this.defaults.selector.caption);
      this.image.nextElementSibling.textContent = image.getAttribute(this.defaults.selector.caption);
      this.image.onload = resolve;
    });
  }



  prepare(evt, image) {
    // Prevents the browser from loading the image in a new tab
    evt.preventDefault();
    
    // Get the image to load based on the attribute
    const target = image.getAttribute(this.defaults.selector.target);
    const caption = image.getAttribute(this.defaults.selector.caption);
    
    // If the target is empty or null, don't do anything
    if (!target) {
      return;
    }

    this.litebox = document.body.appendChild(this.createHTML(target, caption));

    this.litebox.firstElementChild.addEventListener('animationend', (evt) => {
      this.litebox.classList.remove('-fade-in');
    }, { once: true });
  }

  

  createHTML(source, text) {
    // Litebox outer wrapper
    const outer = document.createElement('div');
    outer.classList.add('litebox-outer', '-fade-in');

    // Litebox inner wrapper
    const inner = document.createElement('div');
    inner.classList.add('litebox-inner');

    // Button for closing the litebox
    const close = document.createElement('button');
    close.type = 'button';
    close.title = this.defaults.labels.close;
    close.classList.add('litebox-button-close', 'litebox-button');

    // Button for displaying the next image
    const next = document.createElement('button');
    next.type = 'button';
    next.title = this.defaults.labels.next;
    next.classList.add('litebox-button-next', 'litebox-button');

    // Button for displaying the previous image
    const prev = document.createElement('button');
    prev.type = 'button';
    prev.title = this.defaults.labels.prev;
    prev.classList.add('litebox-button-prev', 'litebox-button');

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
    if (text) {
      const caption = document.createElement('figcaption');
      caption.classList.add('litebox-image-caption');
      caption.textContent = text;
      
      figure.appendChild(caption);
    }
    
    // Build the DOM structure
    outer.appendChild(inner);
    inner.appendChild(close);
    inner.appendChild(next);
    inner.appendChild(prev);
    inner.appendChild(figure);

    // Register event listeners and their handlers
    this.registerHandlers(close, next, prev);
    this.image = image;
    
    // Return the wrapper and all buttons
    return outer;
  }
}