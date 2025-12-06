import { Accordion } from './accordion.js';

function initFooterAccordion(AccordionClass) {
  if (window.innerWidth < 768) {
    const footer = document.querySelector('.footer');
    if (footer && !footer.dataset.accordionInitialized) {
      footer.dataset.accordionInitialized = 'true';
      new AccordionClass('.footer', 'single');
    }
  } else {
    const footer = document.querySelector('.footer');
    if (footer) {
      const items = footer.querySelectorAll('.accordion__item');
      items.forEach((item) => {
        const content = item.querySelector('.accordion__content');
        if (content) {
          content.style.display = '';
          content.style.height = '';
          content.style.overflow = '';
          content.style.transition = '';
        }
      });
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initFooterAccordion(Accordion);
  });
} else {
  initFooterAccordion(Accordion);
}

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const footer = document.querySelector('.footer');
    if (footer && window.innerWidth >= 768) {
      const items = footer.querySelectorAll('.accordion__item');
      items.forEach((item) => {
        const content = item.querySelector('.accordion__content');
        if (content) {
          content.style.display = '';
          content.style.height = '';
          content.style.overflow = '';
          content.style.transition = '';
        }
      });
      footer.removeAttribute('data-accordion-initialized');
    } else if (footer && window.innerWidth < 768 && !footer.dataset.accordionInitialized) {
      initFooterAccordion(Accordion);
    }
  }, 150);
});
