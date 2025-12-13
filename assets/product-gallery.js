(function() {
  'use strict';

  // Инициализируем галерею из полного списка картинок
  function initAllImagesGallery() {
    const swiperMainContainer = document.querySelector('.product-swiper-main');
    const swiperThumbsContainer = document.querySelector('.product-swiper-thumbs');
    const all = (window.PRODUCT_ALL_IMAGES || []).filter(Boolean);
    
    if (window.__DEBUG_BANNER) {
      console.log('[BannerProduct] Initializing gallery with', all.length, 'total images');
    }
    
    if (!swiperMainContainer || !swiperThumbsContainer || !all.length) return;
    
    // helpers
    function getGroupImages(groupIndex) {
      const start = (parseInt(groupIndex, 10) || 0) * 5;
      const groupImages = all.slice(start, start + 5);
      if (window.__DEBUG_BANNER) {
        console.log(`[BannerProduct] Group ${groupIndex}: start=${start}, total images=${all.length}, group images=${groupImages.length}`);
      }
      return groupImages;
    }
    
    function ensureSwipers() {
      if (!window.Swiper) {
        if (window.__DEBUG_BANNER) {
          console.log('[BannerProduct] Swiper not available, using fallback');
        }
        return false;
      }
      
      if (!window.__productThumbs) {
        if (window.__DEBUG_BANNER) {
          console.log('[BannerProduct] Initializing thumbs swiper');
        }
        window.__productThumbs = new Swiper('.product-swiper-thumbs', {
          freeMode: true,
          watchSlidesProgress: true,
          breakpoints: {
            320: { slidesPerView: 'auto', spaceBetween: 16 },
            1280: { slidesPerView: 5, spaceBetween: 0 }
          }
        });
      }
      
      if (!window.__productMain) {
        if (window.__DEBUG_BANNER) {
          console.log('[BannerProduct] Initializing main swiper');
        }
        window.__productMain = new Swiper(swiperMainContainer, {
          slidesPerView: 1,
          thumbs: { swiper: window.__productThumbs },
          breakpoints: {
            320: { spaceBetween: 0 },
            1280: { spaceBetween: 0 }
          }
        });
      }
      
      return true;
    }
    
    function renderGalleryGroup(groupIndex) {
      const images = getGroupImages(groupIndex);
      const thumbsWrapper = swiperThumbsContainer.querySelector('.swiper-wrapper');
      const mainWrapper = swiperMainContainer.querySelector('.swiper-wrapper');
      
      if (!images.length || !thumbsWrapper || !mainWrapper) return;
      
      if (window.__DEBUG_BANNER) {
        console.log(`[BannerProduct] Rendering group ${groupIndex}, images:`, images.length);
      }
      
      if (ensureSwipers()) {
        const main = window.__productMain;
        const thumbs = window.__productThumbs;
        
        // Очищаем все слайды
        if (main.removeAllSlides) main.removeAllSlides();
        if (thumbs.removeAllSlides) thumbs.removeAllSlides();
        
        // Дополнительная очистка HTML (на случай если removeAllSlides не сработал)
        const thumbsWrapper = swiperThumbsContainer.querySelector('.swiper-wrapper');
        const mainWrapper = swiperMainContainer.querySelector('.swiper-wrapper');
        if (thumbsWrapper) thumbsWrapper.innerHTML = '';
        if (mainWrapper) mainWrapper.innerHTML = '';
        
        // Добавляем только изображения текущей группы
        images.forEach((img, i) => {
          const mainSlide = `<div class="swiper-slide"><div class="main-slide"><img src="${img.src}" alt="${img.alt || ''}" srcset="${img.srcset || ''}"></div></div>`;
          const thumbSlide = `<div class="swiper-slide"><div class="thumb-slide"><img src="${img.src}" alt="thumb ${i+1}"></div></div>`;
          main.appendSlide(mainSlide);
          thumbs.appendSlide(thumbSlide);
        });
        
        if (window.__DEBUG_BANNER) {
          console.log(`[BannerProduct] Added ${images.length} slides to thumbs and main`);
        }
        
        main.update();
        thumbs.update();
        main.slideTo(0);
      } else {
        // fallback html
        thumbsWrapper.innerHTML = '';
        mainWrapper.innerHTML = '';
        
        images.forEach((img, i) => {
          thumbsWrapper.innerHTML += `<div class="swiper-slide"><div class="thumb-slide"><img src="${img.src}" alt="thumb ${i+1}"></div></div>`;
        });
        
        if (images[0]) {
          mainWrapper.innerHTML = `<div class="swiper-slide"><div class="main-slide"><img src="${images[0].src}" alt="${images[0].alt || ''}" srcset="${images[0].srcset || ''}"></div></div>`;
        }
        
        if (!swiperThumbsContainer.__fallbackGroupedClick) {
          swiperThumbsContainer.addEventListener('click', (e) => {
            const slide = e.target.closest('.swiper-slide');
            if (!slide) return;
            const idx = Array.from(thumbsWrapper.children).indexOf(slide);
            const img = images[idx];
            if (!img) return;
            mainWrapper.innerHTML = `<div class="swiper-slide"><div class="main-slide"><img src="${img.src}" alt="${img.alt || ''}" srcset="${img.srcset || ''}"></div></div>`;
          });
          swiperThumbsContainer.__fallbackGroupedClick = true;
        }
      }
    }
    
    function renderAllImages() {
      const thumbsWrapper = swiperThumbsContainer.querySelector('.swiper-wrapper');
      const mainWrapper = swiperMainContainer.querySelector('.swiper-wrapper');
      
      if (!all.length || !thumbsWrapper || !mainWrapper) return;
      
      // Ограничиваем количество изображений до 5
      const IMAGE_LIMIT = 5;
      const limitedImages = all.slice(0, IMAGE_LIMIT);
      
      if (window.__DEBUG_BANNER) {
        console.log(`[BannerProduct] Rendering ${limitedImages.length} images (limited from ${all.length})`);
      }
      
      if (ensureSwipers()) {
        const main = window.__productMain;
        const thumbs = window.__productThumbs;
        
        // Очищаем все слайды
        if (main.removeAllSlides) main.removeAllSlides();
        if (thumbs.removeAllSlides) thumbs.removeAllSlides();
        
        // Дополнительная очистка HTML
        if (thumbsWrapper) thumbsWrapper.innerHTML = '';
        if (mainWrapper) mainWrapper.innerHTML = '';
        
        // Добавляем ограниченное количество изображений продукта
        limitedImages.forEach((img, i) => {
          const mainSlide = `<div class="swiper-slide"><div class="main-slide"><img src="${img.src}" alt="${img.alt || ''}" srcset="${img.srcset || ''}"></div></div>`;
          const thumbSlide = `<div class="swiper-slide"><div class="thumb-slide"><img src="${img.src}" alt="thumb ${i+1}"></div></div>`;
          main.appendSlide(mainSlide);
          thumbs.appendSlide(thumbSlide);
        });
        
        if (window.__DEBUG_BANNER) {
          console.log(`[BannerProduct] Added ${limitedImages.length} slides to thumbs and main`);
        }
        
        main.update();
        thumbs.update();
        main.slideTo(0);
      } else {
        // fallback html - добавляем ограниченное количество изображений
        thumbsWrapper.innerHTML = '';
        mainWrapper.innerHTML = '';
        
        limitedImages.forEach((img, i) => {
          thumbsWrapper.innerHTML += `<div class="swiper-slide"><div class="thumb-slide"><img src="${img.src}" alt="thumb ${i+1}"></div></div>`;
          mainWrapper.innerHTML += `<div class="swiper-slide"><div class="main-slide"><img src="${img.src}" alt="${img.alt || ''}" srcset="${img.srcset || ''}"></div></div>`;
        });
        
        if (!swiperThumbsContainer.__fallbackAllClick) {
          swiperThumbsContainer.addEventListener('click', (e) => {
            const slide = e.target.closest('.swiper-slide');
            if (!slide) return;
            const idx = Array.from(thumbsWrapper.children).indexOf(slide);
            const img = limitedImages[idx];
            if (!img) return;
            
            // Обновляем главное изображение
            const mainImg = mainWrapper.querySelector('.main-slide img');
            if (mainImg) {
              mainImg.setAttribute('src', img.src);
              mainImg.setAttribute('alt', img.alt || '');
              if (img.srcset) mainImg.setAttribute('srcset', img.srcset);
            }
          });
          swiperThumbsContainer.__fallbackAllClick = true;
        }
      }
    }
    
    // Очищаем существующие слайды перед инициализацией
    const thumbsWrapper = swiperThumbsContainer.querySelector('.swiper-wrapper');
    const mainWrapper = swiperMainContainer.querySelector('.swiper-wrapper');
    if (thumbsWrapper) thumbsWrapper.innerHTML = '';
    if (mainWrapper) mainWrapper.innerHTML = '';
    
    if (window.__DEBUG_BANNER) {
      console.log('[BannerProduct] Cleared existing slides, rendering all images');
    }
    
    // Добавляем все изображения продукта в слайдер
    renderAllImages();
    
    // expose to other handlers для переключения групп при выборе цвета
    window.__renderGalleryGroup = renderGalleryGroup;
  }
  
  // Инициализируем галерею при загрузке DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllImagesGallery);
  } else {
    initAllImagesGallery();
  }
  
  // Запускаем базовую галерею сразу
  try {
    initAllImagesGallery();
  } catch(e) {
    console.warn('Init gallery error', e);
  }
})();

