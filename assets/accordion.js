function slideDown(element, duration = 300) {
  element.style.display = 'block';
  const height = element.scrollHeight;
  element.style.height = '0px';
  element.style.overflow = 'hidden';
  element.style.transition = `height ${duration}ms ease`;

  requestAnimationFrame(() => {
    element.style.height = `${height}px`;
  });

  setTimeout(() => {
    element.style.height = '';
    element.style.overflow = '';
    element.style.transition = '';
  }, duration);
}

function slideUp(element, duration = 300) {
  const height = element.scrollHeight;
  element.style.height = `${height}px`;
  element.style.overflow = 'hidden';
  element.style.transition = `height ${duration}ms ease`;

  requestAnimationFrame(() => {
    element.style.height = '0px';
  });

  setTimeout(() => {
    element.style.display = 'none';
    element.style.height = '';
    element.style.overflow = '';
    element.style.transition = '';
  }, duration);
}

export class Accordion {
  constructor(containerSelector, mode = 'single', animationDuration = 300) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.mode = mode;
    this.duration = animationDuration;
    this.items = this.container.querySelectorAll('.accordion__item');

    this.init();
  }

  init() {
    this.items.forEach((item) => {
      const trigger = item.querySelector('.accordion__trigger');
      const content = item.querySelector('.accordion__content');

      if (!item.classList.contains('active')) {
        content.style.display = 'none';
      }

      if (trigger) {
        trigger.addEventListener('click', () => {
          this.toggleItem(item);
        });
      }
    });
  }

  toggleItem(item) {
    const isActive = item.classList.contains('active');
    const content = item.querySelector('.accordion__content');

    if (this.mode === 'single') {
      this.items.forEach((el) => {
        const elContent = el.querySelector('.accordion__content');
        if (el !== item && el.classList.contains('active')) {
          el.classList.remove('active');
          slideUp(elContent, this.duration);
        }
      });
    }

    if (isActive) {
      item.classList.remove('active');
      slideUp(content, this.duration);
    } else {
      item.classList.add('active');
      slideDown(content, this.duration);
    }
  }
}
