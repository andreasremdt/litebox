/*!
 * Litebox 0.8.3
 * by Andreas Remdt
 *
 * Official repository:
 * https://github.com/andreasremdt/litebox
 *
 * Copyright Andreas Remdt
 * Released under the MIT license
 */

var Litebox = (function() {
  "use strict";

  var template = `
    <div class="litebox" data-action="wrapper">
      <div class="litebox-wrapper" data-action="inner">
        <button class="litebox-button litebox-button-close" data-action="close">Close</button>
        <button class="litebox-button litebox-button-next" data-action="next">Show next image</button>
        <button class="litebox-button litebox-button-prev" data-action="prev">Show previous image</button>
        <figure class="litebox-image-wrapper">
          <img class="litebox-image" data-action="image">
          <figcaption class="litebox-caption" data-action="caption"></figcaption>
        </figure>
      </div>
      <div class="litebox-error" data-action="error">Sorry, the image couldn't be loaded.</div>
      <div class="litebox-loader" data-action="loader"></div>
    </div>
  `;

  class Litebox {
    constructor(options) {
      if (options && !Litebox._isObject(options)) {
        console.warn(`[Litebox] Expected an object as configuration, received ${typeof options}. Default configuration is used instead.`);

        this.options = Litebox.defaults;
      } else {
        this.options = Litebox._merge(Litebox.defaults, options);
      }

      this._current = null;
      this._litebox = null;
      this._x = 0;
      this._y = 0;
      this._images = document.querySelectorAll(this.options.el);
      
      this._buildCollection(this._images);

      this._images.forEach(image => image.addEventListener("click", (evt) => {
        evt.preventDefault();

        this.handleOpen(image);
      }));
    }



    /**
     * Gets the template containing the HTML structure for Litebox.
     * 
     * If a user provided a custom template (and if it was found), it will
     * be used. Otherwise the default template (see on top) will be used.
     *
     * @return HTMLTemplateElement
     */
    getTemplate() {
      var node = document.createElement("template"),
          override = document.querySelector(this.options.template);

      node.innerHTML = override
        ? override.innerHTML || template
        : template;
      
      return node;
    }



    /**
     * Asynchonously loads an image and returns a Promise which
     * is either fulfilled if the image has been fetched or failed
     * if the URL didn't respond with a 200 status code.
     *
     * @param {String} src The URL to fetch the image from.
     * @param {HTMLImageElement} image The image node.
     * @return Promise
     */
    loadImage(src, img) {
      return new Promise((resolve, reject) => {
        var tmp = new Image();

        tmp.onload = resolve;
        tmp.onerror = reject;
        tmp.src = src;
        img.src = src;
      });
    }



    /**
     * Renders the entire Litebox structure conditionally based on
     * image properties and user configuration.
     *
     * @param {HTMLTemplateElement} html The HTML template.
     * @param {HTMLImageElement} target The image to be rendered.
     * @return {HTMLTemplateElement} The processed HTML structure.
     */
    render(html, target) {
      var src = target.getAttribute(this.options.target),
          caption = target.getAttribute(this.options.caption),
          figcaption = html.querySelector('[data-action="caption"]'),
          inner = html.querySelector('[data-action="inner"]'),
          img = html.querySelector('[data-action="image"]'),
          next = html.querySelector('[data-action="next"]'),
          error = html.querySelector('[data-action="error"]'),
          loader = html.querySelector('[data-action="loader"]'),
          prev = html.querySelector('[data-action="prev"]');

      error.setAttribute("hidden", true);
      inner.setAttribute("hidden", true);
      loader.removeAttribute("hidden");
      next.setAttribute("hidden", true);
      prev.setAttribute("hidden", true);

      this.loadImage(src, img)
        .then(() => inner.removeAttribute("hidden"))
        .catch(() => error.removeAttribute("hidden"))
        .finally(() => loader.setAttribute("hidden", true));

      if (caption) {
        figcaption.removeAttribute("hidden");
        figcaption.textContent = caption;
      } else {
        figcaption.setAttribute("hidden", true);
        figcaption.textContent = "";
      }

      if (this._isInGallery()) {
        if (!this._isLast() || this.options.loop) {
          next.removeAttribute("hidden");
        }

        if (!this._isFirst() || this.options.loop) {
          prev.removeAttribute("hidden");
        }
      }

      return html;
    }



    /**
     * Removes Litebox from the document and destroys all event handlers
     * to prevent memory leaks.
     */
    close() {
      if (this._litebox) {
        document.body.removeChild(this._litebox);
        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("touchstart", this.handleTouchStart);
        window.removeEventListener("touchmove", this.handleTouchMove);

        this._litebox = null;
        this._current = null;
      }
    }



    /**
     * Displays the next/previous image. Checks if there is a
     * next/previous image and then calls the render function.
     *
     * @param {String} direction: Either `next` or `prev`.
     */
    switch(direction) {
      var image = this.exists(direction);

      if (image) {
        this._current = image;

        this.render(this._litebox, image);
      }
    }



    /**
     * In case an image is part of a gallery, checks if there's
     * a next/previous image in the gallery. If so, returns the 
     * found image. If the user has set `loop` to true in the options and
     * the first/last image has been reached, it will return the first/last
     * image in the gallery.
     *
     * @param {String} direction: Either `next` or `prev`.
     * @return {HTMLImageElement}
     */
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
     * Registers mouse, keyboard and touch events. Keyboard and touch
     * can be disabled from the config.
     */
    registerEvents() {
      this._litebox.addEventListener("click", this.handleClick);

      if (this.options.keyboard) {
        window.addEventListener("keydown", this.handleKeyDown);
      }

      if (this.options.touch) {
        window.addEventListener("touchstart", this.handleTouchStart);
        window.addEventListener("touchmove", this.handleTouchMove);
      }
    }



    /**
     * Handles the click event the user triggered by opening
     * an image. Takes the image that the user clicked on as the 
     * only parameter and appends the rendered Litebox to the document.
     *
     * @param {HTMLElement} image The image the user clicked on.
     */
    handleOpen = (image) => {
      this._current = image;

      var html = this.render(
        this.getTemplate().content.cloneNode(true),
        image
      );

      document.body.appendChild(html);

      this._litebox = document.querySelector('[data-action="wrapper"]');
      this.registerEvents();
    }



    /**
     * Handles the click event the user triggered through the Litebox
     * buttons (next, prev, close). Decides which action should be done
     * based on the action attribute.
     *
     * @param {Event} evt
     */
    handleClick = (evt) => {
      switch (evt.target.dataset.action) {
        case "next":
        case "prev":
          this.switch(evt.target.dataset.action);
          break;

        case "wrapper":
        case "close":
          this.close();
          break;
      }
    }
    


    /**
     * Handles the keyboard event the user triggered by pressing any key
     * on the keyboard. Decides which action should be done based on the keycode.
     *
     * @param {Event} evt
     */
    handleKeyDown = (evt) => {
      switch (evt.keyCode) {
        case 27:
          this.close();
          break;
        
        case 39:
          this.switch("next");
          break;
          
          case 37:
          this.switch("prev");
          break;
      }
    }



    /**
     * Handles the touch event the user triggered by touching
     * on the screen. It will store the coordinates of the touch.
     *
     * @param {Event} evt
     */
    handleTouchStart = (evt) => {
      this._x = evt.touches[0].clientX;
      this._y = evt.touches[0].clientY;
    }



    /**
     * Handles the touch event the user triggered by swiping
     * on the screen. If a swipe has been detected, it will decide
     * the direction and show the next/previous image.
     *
     * @param {Event} evt
     */
    handleTouchMove = (evt) => {
      var x = evt.touches[0].clientX;
      var y = evt.touches[0].clientY;

      if (Math.abs(this._x - x) > Math.abs(this._y - y)) {
        if ((this._x - x) > 0) {
          this.switch('next');
        } else {
          this.switch('prev');
        }
      } else {
        if ((this._y - y) < 0) {
          this.close();
        }
      }

      this._x = null;
      this._y = null;
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
    _buildCollection(images) {
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
     * Deep merges two objectes. This function is used for merging the
     * default config with the custom one the user can submit.
     *  
     * @param {Object} target The target object to merge in
     * @param {Object} source The source object to merge from
     * @returns {Object}
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
        keyboard: true,
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
        }
      };
    }
  }

  return Litebox;
})();
