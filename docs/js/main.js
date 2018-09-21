(function() {
  'use strict';

  var menuToggle = document.querySelector('button[data-menu-toggle]');
  var menuWrapper = document.querySelector('div[data-menu]');

  menuToggle.addEventListener('click', function() {
    menuWrapper.classList.toggle('is-active');
    menuToggle.classList.toggle('is-active');
  });
})();



function toc() {
  var headings = document.querySelectorAll('h2, h3, h4, h5, h6');
  var sidebar = document.querySelector('[data-sidebar]');
  var wrapper = document.createElement('nav');

  if (!sidebar) {
    return;
  }

  [].forEach.call(headings, function(heading) {
    var item = document.createElement('a');

    item.textContent = heading.textContent;
    item.href = '#' + heading.id;
    item.classList.add('item');
    
    wrapper.appendChild(item);
  });

  wrapper.classList.add('table-of-contents');
  sidebar.appendChild(wrapper);
}

toc();

new Litebox();