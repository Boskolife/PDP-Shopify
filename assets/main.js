import { Accordion } from "./accordion.js";

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        initProductColorSelector();
        initProductSizeSelector();
        initFooterAccordion(Accordion);
    });
} else {
    initProductColorSelector();
    initProductSizeSelector();
    initFooterAccordion(Accordion);
}

function initFooterAccordion(AccordionClass) {
    if (window.innerWidth < 768) {
        const footer = document.querySelector(".footer");
        if (footer && !footer.dataset.accordionInitialized) {
            footer.dataset.accordionInitialized = "true";
            new AccordionClass(".footer", "single");
        }
    } else {
        const footer = document.querySelector(".footer");
        if (footer) {
            const items = footer.querySelectorAll(".accordion__item");
            items.forEach((item) => {
                const content = item.querySelector(".accordion__content");
                if (content) {
                    content.style.display = "";
                    content.style.height = "";
                    content.style.overflow = "";
                    content.style.transition = "";
                }
            });
        }
    }
}


let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const footer = document.querySelector(".footer");
        if (footer && window.innerWidth >= 768) {
            const items = footer.querySelectorAll(".accordion__item");
            items.forEach((item) => {
                const content = item.querySelector(".accordion__content");
                if (content) {
                    content.style.display = "";
                    content.style.height = "";
                    content.style.overflow = "";
                    content.style.transition = "";
                }
            });
            footer.removeAttribute("data-accordion-initialized");
        } else if (
            footer &&
            window.innerWidth < 768 &&
            !footer.dataset.accordionInitialized
        ) {
            initFooterAccordion(Accordion);
        }
    }, 150);
});

function initProductColorSelector() {
    const productColorSelector = document.querySelector(
        ".product_color_selector"
    );
    if (productColorSelector) {
        const items = productColorSelector.querySelectorAll(
            ".product_color_selector__item"
        );
        items.forEach((item) => {
            item.addEventListener("click", () => {
                items.forEach((el) => el.classList.remove("active"));
                item.classList.add("active");
            });
        });
    }
}

function initProductSizeSelector() {
    const productSizeSelector = document.querySelector(
        ".product_size_selector"
    );
    if (productSizeSelector) {
        const items = productSizeSelector.querySelectorAll(
            ".product_size_selector__item"
        );
        items.forEach((item) => {
            item.addEventListener("click", () => {
                items.forEach((el) => el.classList.remove("active"));
                item.classList.add("active");
            });
        });
        
        // Устанавливаем первый доступный вариант как активный по умолчанию
        if (window.PRODUCT_VARIANTS) {
            const firstAvailableItem = Array.from(items).find(item => {
                const variantId = item.dataset.variantId;
                if (!variantId) return false;
                const variant = window.PRODUCT_VARIANTS.find(v => v.id === parseInt(variantId));
                return variant && variant.available;
            });
            
            if (firstAvailableItem && !document.querySelector(".product_size_selector__item.active")) {
                firstAvailableItem.click();
            }
        }
    }
}

