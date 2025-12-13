(function() {
  const form = document.getElementById('product-add-to-cart-form');
  if (!form) return;

  const variantIdInput = document.getElementById('product-variant-id');
  const quantityInput = document.getElementById('product-quantity');
  const submitButton = document.getElementById('product-add-to-cart-button');

  if (!variantIdInput || !submitButton) return;

  // Получаем тексты из data-атрибутов формы
  const addToCartText = form.dataset.addToCartText || 'Add to cart';
  const notAvailableText = form.dataset.notAvailableText || 'Not available';
  const addingText = form.dataset.addingText || 'Adding...';

  // Обновление варианта при выборе размера
  function updateVariantId(variantId) {
    if (!variantId) return;

    variantIdInput.value = variantId;

    // Обновляем состояние кнопки на основе доступности варианта
    if (window.PRODUCT_VARIANTS) {
      const variant = window.PRODUCT_VARIANTS.find(v => v.id === parseInt(variantId));
      if (variant) {
        submitButton.disabled = !variant.available;
        submitButton.textContent = variant.available ? addToCartText : notAvailableText;
      }
    }
  }

  // Обновление секции header через Section Rendering API
  async function updateCartSection() {
    try {
      // Находим ID секции header
      const headerSection = document.querySelector('header[data-section-id]');
      if (!headerSection) return;

      const sectionId = headerSection.dataset.sectionId;
      if (!sectionId) return;

      // Получаем обновленную секцию header через Section Rendering API
      const rootUrl = window.Shopify?.routes?.root || '/';
      const response = await fetch(`${rootUrl}?section_id=${sectionId}`);
      if (!response.ok) return;

      const responseText = await response.text();
      let html = responseText;
      
      // Shopify Section Rendering API может вернуть JSON с ключом sections
      try {
        const json = JSON.parse(responseText);
        if (json.sections && json.sections[sectionId]) {
          html = json.sections[sectionId];
        }
      } catch (e) {
        // Если не JSON, используем как есть
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Ищем секцию в ответе
      let newHeader = doc.querySelector(`#shopify-section-${sectionId}`);
      if (!newHeader) {
        newHeader = doc.querySelector(`[data-section-id="${sectionId}"]`);
      }
      if (!newHeader && doc.body) {
        newHeader = doc.body.querySelector('header');
      }

      if (newHeader) {
        // Обновляем только счетчик корзины
        const newCartCount = newHeader.querySelector('#cart-count');
        const currentCartCount = headerSection.querySelector('#cart-count');
        
        if (newCartCount && currentCartCount) {
          currentCartCount.innerHTML = newCartCount.innerHTML;
        }
      }
    } catch (error) {
      console.error('Error updating cart section:', error);
    }
  }

  // Добавление товара в корзину через AJAX
  async function addToCart(variantId, quantity) {
    try {
      submitButton.disabled = true;
      const originalText = submitButton.textContent;
      submitButton.textContent = addingText;

      const rootUrl = window.Shopify?.routes?.root || '/';
      const response = await fetch(`${rootUrl}cart/add.js`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: variantId,
          quantity: quantity || 1
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.description || 'Failed to add to cart');
      }

      // Обновляем счетчик корзины через Section Rendering
      await updateCartSection();

      // Возвращаем состояние кнопки
      submitButton.disabled = false;
      submitButton.textContent = originalText;

      // Можно добавить уведомление об успешном добавлении
      // Например, показать временное сообщение или анимацию

    } catch (error) {
      console.error('Error adding to cart:', error);
      submitButton.disabled = false;
      submitButton.textContent = addToCartText;
      alert(error.message || 'Failed to add product to cart. Please try again.');
    }
  }

  // Перехватываем отправку формы
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const variantId = variantIdInput.value;
    const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

    if (!variantId) {
      alert('Please select a variant');
      return;
    }

    addToCart(variantId, quantity);
  });

  // Слушаем клики на селекторе размера (дополнительно к main.js)
  const sizeSelector = document.querySelector('.product_size_selector');
  if (sizeSelector) {
    sizeSelector.addEventListener('click', function(e) {
      const sizeButton = e.target.closest('.product_size_selector__item');
      if (sizeButton && sizeButton.dataset.variantId) {
        updateVariantId(sizeButton.dataset.variantId);
      }
    });
  }

  // Обновляем вариант при загрузке страницы (если есть активный выбор)
  function initVariantFromActiveSize() {
    const activeSizeButton = document.querySelector('.product_size_selector__item.active');
    if (activeSizeButton && activeSizeButton.dataset.variantId) {
      updateVariantId(activeSizeButton.dataset.variantId);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVariantFromActiveSize);
  } else {
    initVariantFromActiveSize();
  }
})();

