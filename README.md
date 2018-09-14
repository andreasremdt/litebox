
# Litebox

> A modern, lightweight, accessible, responsive and touch-friendly lightbox to showcase your images.
> *Currently in **alpha development**!*

## Getting started

1. Download the latest release of Litebox from this repository to your computer.
2. Extract the ZIP-file. Copy `litebox.min.js` into your JavaScript folder and `litebox.min.css` into your CSS folder.
3. Add the stylesheet into your document's head:
	```html
	<link rel="stylesheet" href="path/to/litebox.min.css">
	```
4. Add the script above your  closing `</body>` tag:
	```html
	<script src="path/to/litebox.min.js" defer></script>
	```
5. Below the script from step 4, paste the following code:
	```html
	<script>
		new Litebox(options);
	</script>
	```
6. In order for Litebox to recognize your images, put the `data-litebox` attribute on the anchor element, like this:
	```html
	<a href="path/to/image.jpg" title="Your awesome image caption" data-litebox>
		<img src="path/to/preview.jpg" alt="Beautiful image preview">
	</a>
	```
	By passing an object into the constructor, you can change the behavior to whatever you prefer, but if you just 	want to get started quickly this is the way to go.
7. Enjoy your beautiful images!

## Features

* **Dependency-free** - Litebox doesn't depend on any third-party scripts like jQuery or lodash. Include one script and you're good to go.
* **Lightweight** - Compressed and minified, the script only weights around 10 KB, which makes it load quickly into your website.
* **Customizable** - You can customize the behavior, such as animations or selectors. Litebox adapts to your needs.
* **Responsive** - Litebox is shipped with a modern set of CSS (Flexbox) to adapt to every screen size.
* **Touch-friendly** - No matter if with a keyboard, mouse or touchscreen - you can swipe through your images with almost any input method.
* **Cross-browser support** - Tested in Chrome, Firefox, Edge, Internet Explorer 11, Opera and other brothers.
* **Modern** - Litebox is built using the latest ES6 features and compiled down into ES5 for better compatibility. 

## Options

You can configure Litebox to your needs and wishes. See all available options below. Just pass an object into the constructor and you're good to go.
Still unsure how it's done? See [examples](#examples).

| Option | Type | Default | Description |
|--|--|--|--|
| el | `String` | `[data-litebox]` | The element selector. You can add whatever class, id, tag name or data attribute. |
| target | `String` | `href` | The attribute that refers to the image to display. Can be any other attribute. |
| caption | `String` | `title` | The attribute that defines a caption for each image. Can be any other attribute. |
| gallery | `Boolean` | `true` | Whether to make a gallery (switching the image using the "Next" or "Previous" buttons) or display only a single image. |
| keyboardShortcuts | `Boolean` | `true` | If enabled, you can close Litebox using ESC and use the arrow keys to switch images. |
| touch | `Boolean` | `true` | If enabled, touch gestures will be recognized (swipe left/right to switch images and swipe down to close Litebox). |
| autohideControls | `Boolean` | `true` | If enabled, the control buttons and caption are hidden after 2.5 seconds if the mouse is not moved. |
| loop | `Boolean` | `false` | Whether to display the first image once the end of the gallery has been reached and vice-versa. |
| slidehow | `Boolean`, `Number` | `false` | If enabled, Litebox will display a slideshow. Instead of `true`, enter the number of milliseconds you want to pass between each image change (like `5000` for 5s). |
| animation | `String` | `swipe` | The type of animations you wish to use. Available are `swipe`, `fade`, `zoom` and `none`. |
| labels | `Object` | | You can pass an object with custom labels for the buttons. See [here](#labels). |
| classNames | `Object` | | You can change all names of the CSS classes if you wish to customize your CSS. See [here](#class-names). |

### Labels

You can override the titles for each button, for example if you want to change the language. Pass an object with one or more of the following attributes into the `labels` key:

| Option | Type | Default | Description |
|--|--|--|--|
| close | `String` | Close Litebox | The title for the close button. |
| next | `String` | Next image | The title for the "Next image" button. |
| prev | `String` | Previous image | The title for the "Previous image" button. |

### Class names

If you want to customize your CSS or don't like the [BEM](http://getbem.com/) approach, you can change all class names to whatever you prefer. Pass an object with one or more of the following attributes into the `classNames` key:

| Option | Element | Default | Description |
|--|--|--|--|
| outer | `<div>` | `litebox-outer` | The outer wrapper, used for the overlay and to center the inner content. |
| inner | `String` | `litebox-inner` | The inner content is used to make the image responsive. |
| figure | `String` | `litebox-image-wrapper` | The `<figure>`  |
| caption | `String` | `litebox-image-caption` | The title for the "Previous image" button. |
| image | `String` | `litebox-image` | The title for the "Previous image" button. |
| buttonGeneral | `String` | `litebox-button` | The title for the "Previous image" button. |
| buttonClose | `String` | `litebox-button-close` | The title for the "Previous image" button. |
| buttonPrev | `String` | `litebox-button-prev` | The title for the "Previous image" button. |
| buttonNext | `String` | `litebox-button-next` | The title for the "Previous image" button. |

By default, all classes are namespaced with `litebox-`. Be careful changing the class names, as it could conflict with other styles in your project. 

### Examples

> Coming soon

## Bugs and feature requests

If you find a bug, please report it [here](https://github.com/andreasremdt/litebox/issues). I'm happy about any kind of productive feedback.

Feature requests are welcome, as far as they make sense.

## License

MIT License

Copyright (c) 2018 Andreas Remdt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.