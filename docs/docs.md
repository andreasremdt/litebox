---
title: Documentation
layout: default
lead: Let's get started with Litebox and learn about what it is and what it offers you.
---

## About Litebox

Litebox is a JavaScript plugin which you can add to a website or web application to present images to your visitors. If you have clickable image thumbnails on your page, Litebox opens them in a beautiful overlay with captions and gallery functions.

### Features

* **Lightweight:** Most lightbox plugins are quite big and offer a ton of functionality. Litebox, as the name implies, is different. It just concentrates on displaying your images, nothing less or more. It only weights 12 KB (compressed) and loads quickly onto your page.
* **No dependencies:** Instead of relying on jQuery, Litebox is written with native JavaScript features and doesn't depend on any other library to do it's job. That's why it's so quick to load.
* **Customizable:** When you add Litebox to your page, you can configure its behavior by passing an object to it. Thinks like animations, touch-gestures, image sources and more can be set to match your expactations.
* **Cross-browser-support:** Although Litebox is written with EcmaScript 2015 features, it is being compiled into more compatible EcmaScript 5 code to support a wider range of browsers.
* **Touch- and keyboard-friendy:**: You can control Litebox with a mouse, keyboard or touch gestures on a tablet or smartphone. These features can also be disabled in the configuration.

### Compatibility

Litebox works well on desktop and mobile browsers and even accepts touch-gestures. It is tested in the following browsers:

* Chrome (Mobile / Desktop)
* Firefox
* Edge
* Internet Explorer 11
* Safari (on iOS)

Unfortunately, I couldn't do any more tests on other devices, if you want to add to this list, feel free to open a push request or report on GitHub.

### License & Contribution

All of Litebox is licensed under MIT and therefore completely free and open-source. If you want to help me with the development, report a bug or comment on any other thing that comes to your mind feel free to do so on GitHub. Any feedback is appreciated.

## Setup

Installing Litebox is quite easy. Just follow the steps below.

### Download

You can download the compiled and production-ready code here. If you prefer the raw source, head to GitHub and clone the repository.

### Installation

Once you have downloaded the code, you'll find three folders with a few files. The `js` and `css` folders each contain 2 files, a compressed and an uncompressed one. Compressed files have the `.min` extension. Link one of each to your HTML project like to:

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Your Awesome Page Title</title>
    
    <!-- Litebox CSS -->
    <link rel="stylesheet" href="css/litebox.min.css">
  </head>
  <body>

    <!-- Litebox JavaScript -->
    <script src="js/litebox.min.js" defer></script>
    <script>
      new Litebox(options);
    </script>
  </body>
</html>
```

Please note that you have to *call* Litebox with the `new Litebox()` constructor. Otherwise it won't be active. You don't have to do this with inline scripts, you could also add a seperate JavaScript file below and put the code inside it.

The `options` object that is passed through the constructor is **optional**, you can call it without passing any options like so: `new Litebox();`.

### Preparing the images

Now that the script and JavaScript file are in place, it's time to tell Litebox which images to use. Later, you can customize the following using custom options, but we'll stick to the default for now.

Wrap each image into an anchor tag and give it the `data-litebox` attribute.

* If you want to include a caption, add the `title` attribute.
* If you want to create an image gallery, add the `data-gallery` attribute to each anchor.

```html
  <!-- Example without title -->
  <a href="images/forest.jpg" data-litebox>
    <img src="images/thumbs/forest-thumb.jpg" alt="A forest at sunset" width="320" height="240">
  </a>

  <!-- Example with title -->
  <a href="images/forest.jpg" data-litebox title="This image shows a beautiful forest at sunset.">
    <img src="images/thumbs/forest-thumb.jpg" alt="A forest at sunset" width="320" height="240">
  </a>

  <!-- Example with title and gallery -->
  <a href="images/forest.jpg" data-litebox title="This image shows a beautiful forest at sunset." data-gallery="nature">
    <img src="images/thumbs/forest-thumb.jpg" alt="A forest at sunset" width="320" height="240">
  </a>

<a href="images/lake.jpg" data-litebox title="Lakes still hold secrets deep underneath their surface." data-gallery="nature">
    <img src="images/thumbs/lake-thumb.jpg" alt="A forest at sunset" width="320" height="240">
  </a>
```

## Options

### JavaScript

Litebox accepts the following parameters upon initialization. You can pass them as an object into the `new Litebox()` constructor.

```js
new Litebox({
  // The element selector. You can add whatever class, id, tag name or data attribute.
  el: '[data-litebox]',

  // The attribute that refers to the image (URL) to display. Can be any other attribute.
  target: 'href',

  // The attribute that defines a caption for each image. Can be any other attribute.
  caption: 'title',

  // Whether to make a gallery (switching the image using the "Next" or "Previous"
  // buttons) or display only a single image.
  gallery: true,

  // If enabled, you can close Litebox using ESC and use the arrow keys to switch between
  // images in a gallery.
  keyboardShortcuts: true,

  // If enabled, touch gestures will be recognized (swipe left/right to switch images
  // and swipe down to close Litebox).
  touch: true,

  // If enabled, the control buttons and caption are hidden after 2.5 seconds if
  // the mouse is not moved.
  autohideControls: true,

  // Whether to display the first image once the end of the gallery has
  // been reached and vice-versa.
  loop: false,
  
  // If enabled, Litebox will display a slideshow. Instead of true, enter the
   //number of milliseconds you want to pass between each image change (like 5000 for 5s).
  slidehow: false,

  // Whether animations are enabled or disabled.
  animations: true,

  // You can pass an object with custom labels for the buttons.
  labels: {
    // The title for the close button.
    close: 'Close Litebox',

    // The title for the "Next image" button.
    next: 'Next image',

    // 	The title for the "Previous image" button.
    prev: 'Previous image'
  },

  // You can change all names of the CSS classes if you wish to customize your CSS.
  classNames: {
    // The outer wrapper, used for the overlay and to center the inner content.
    outer: 'litebox',

    // The inner content is used to make the image responsive.
    inner: 'litebox-wrapper',

    // The <figure> tag that wraps the image.
    figure: 'litebox-image-wrapper',

    // The <figcaption> tag for the image caption.
    caption: 'litebox-image-caption',

    // The actual image.
    image: 'litebox-image',

    // A general class that is applied to all buttons.
    buttonGeneral: 'litebox-button',

    // The closing button.
    buttonClose: 'litebox-button-close',

    // The button to display the previous image.
    buttonPrev: 'litebox-button-prev',

    // The button to display the next image.
    buttonNext: 'litebox-button-next'
  }
});
```