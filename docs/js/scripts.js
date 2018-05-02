(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    
    var litebox = new Litebox();
    var links = document.querySelectorAll('[data-link]');
    
    links.forEach(function(link) {
      link.addEventListener('click', function(event) {
        event.preventDefault();

        document.querySelector(event.target.hash).scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });

        links.forEach(function(item) {
          item.classList.remove('-active');
        });

        event.target.classList.add('-active');
      });
    });
  });
})();