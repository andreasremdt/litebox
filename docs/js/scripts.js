(function() {
  'use strict';


  document.addEventListener("DOMContentLoaded", function() {
    var sections = [].slice.call(document.querySelectorAll("[data-section]"));
    var links = [].slice.call(document.querySelectorAll('[data-link]'));

    var clearNavigationLinks = function() {
      links.forEach(link => link.classList.remove('is-active'));
    };

    var setNavigationLinkActive = function(target) {
      links.forEach(function(link) {
        if (link.href.includes(target.id)) {
          link.classList.add('is-active');
        }
      });
    };

    var scrollToSection = function(event) {
      event.preventDefault();

      document.querySelector(event.target.hash).scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    };


    if ("IntersectionObserver" in window) {
      let sectionObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            clearNavigationLinks();
            setNavigationLinkActive(entry.target);
          }
        });
      });

      sections.forEach(function(section) {
        sectionObserver.observe(section);
      });
    }

    links.forEach(link => link.addEventListener("click", scrollToSection));

    new Litebox();
  });
})();