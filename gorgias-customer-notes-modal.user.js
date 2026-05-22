// ==UserScript==
// @name         Gorgias - Customer Notes Modal Editor
// @namespace    https://github.com/YOUR_ORG/gorgias-customer-notes-modal
// @version      2.1
// @description  Opens Gorgias customer notes in a large centered modal editor.
// @author       Kalin Popov
// @license      MIT
// @match        https://*.gorgias.com/*
// @match        https://app.gorgias.com/*
// @run-at       document-idle
// @grant        none
// @updateURL    https://raw.githubusercontent.com/KalinAngelo/gorgias-customer-notes-modal/main/gorgias-customer-notes-modal.user.js
// @downloadURL  https://raw.githubusercontent.com/KalinAngelo/gorgias-customer-notes-modal/main/gorgias-customer-notes-modal.user.js
// ==/UserScript==

(function () {
  "use strict";

  const SELECTOR = 'textarea#note-field[aria-label="Note"]';

  const COLLAPSED_HEIGHT = 72;
  const MODAL_MAX_HEIGHT = "85vh";
  const MODAL_WIDTH = "794px"; // approx A4 width at 96dpi
  const MODAL_MAX_WIDTH = "92vw";

  let lastTextarea = null;
  let resizeQueued = false;
  let isModalOpen = false;

  function setNativeTextareaValue(textarea, value) {
    const prototype = window.HTMLTextAreaElement.prototype;
    const valueSetter = Object.getOwnPropertyDescriptor(
      prototype,
      "value",
    )?.set;

    if (valueSetter) {
      valueSetter.call(textarea, value);
    } else {
      textarea.value = value;
    }
  }

  function dispatchGorgiasEvents(textarea) {
    textarea.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        cancelable: true,
        inputType: "insertText",
        data: null,
      }),
    );

    textarea.dispatchEvent(
      new Event("change", {
        bubbles: true,
        cancelable: true,
      }),
    );

    textarea.dispatchEvent(
      new FocusEvent("blur", {
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  function saveToGorgias(sourceTextarea, value) {
    if (!sourceTextarea) return;

    sourceTextarea.focus();

    setNativeTextareaValue(sourceTextarea, value);
    sourceTextarea.setAttribute("value", value);

    dispatchGorgiasEvents(sourceTextarea);

    // Some React/SPA UIs need one more tick after focus/value update.
    setTimeout(() => {
      setNativeTextareaValue(sourceTextarea, value);
      dispatchGorgiasEvents(sourceTextarea);
      sourceTextarea.blur();
    }, 0);
  }

  function styleCollapsedField(textarea) {
    textarea.style.setProperty("height", `${COLLAPSED_HEIGHT}px`, "important");
    textarea.style.setProperty(
      "min-height",
      `${COLLAPSED_HEIGHT}px`,
      "important",
    );
    textarea.style.setProperty(
      "max-height",
      `${COLLAPSED_HEIGHT}px`,
      "important",
    );
    textarea.style.setProperty("overflow-y", "auto", "important");
    textarea.style.setProperty("resize", "none", "important");
    textarea.style.setProperty("box-sizing", "border-box", "important");
    textarea.style.setProperty("line-height", "1.4", "important");
    textarea.style.setProperty("white-space", "pre-wrap", "important");
    textarea.style.setProperty("overflow-wrap", "anywhere", "important");
    textarea.style.setProperty("cursor", "pointer", "important");
  }

  function queueStyleCollapsed(textarea) {
    lastTextarea = textarea || lastTextarea;

    if (resizeQueued) return;
    resizeQueued = true;

    window.requestAnimationFrame(() => {
      resizeQueued = false;
      if (lastTextarea && !isModalOpen) {
        styleCollapsedField(lastTextarea);
      }
    });
  }

  function closeModal({
    overlay,
    modalTextarea,
    sourceTextarea,
    shouldSave = true,
  }) {
    if (!overlay || !modalTextarea || !sourceTextarea) return;

    if (shouldSave) {
      saveToGorgias(sourceTextarea, modalTextarea.value);
    }

    overlay.remove();
    isModalOpen = false;

    queueStyleCollapsed(sourceTextarea);
  }

  function openModal(sourceTextarea) {
    if (!sourceTextarea || isModalOpen) return;

    isModalOpen = true;

    const overlay = document.createElement("div");
    overlay.dataset.gorgiasNotesModalOverlay = "true";

    overlay.style.setProperty("position", "fixed", "important");
    overlay.style.setProperty("inset", "0", "important");
    overlay.style.setProperty("z-index", "2147483647", "important");
    overlay.style.setProperty("display", "flex", "important");
    overlay.style.setProperty("align-items", "center", "important");
    overlay.style.setProperty("justify-content", "center", "important");
    overlay.style.setProperty("padding", "24px", "important");
    overlay.style.setProperty(
      "background",
      "rgba(15, 23, 42, 0.35)",
      "important",
    );
    overlay.style.setProperty("backdrop-filter", "blur(4px)", "important");
    overlay.style.setProperty(
      "-webkit-backdrop-filter",
      "blur(4px)",
      "important",
    );

    const modal = document.createElement("div");
    modal.dataset.gorgiasNotesModal = "true";

    modal.style.setProperty("width", MODAL_WIDTH, "important");
    modal.style.setProperty("max-width", MODAL_MAX_WIDTH, "important");
    modal.style.setProperty("height", MODAL_MAX_HEIGHT, "important");
    modal.style.setProperty("max-height", MODAL_MAX_HEIGHT, "important");
    modal.style.setProperty("display", "flex", "important");
    modal.style.setProperty("flex-direction", "column", "important");
    modal.style.setProperty("background", "#ffffff", "important");
    modal.style.setProperty("border-radius", "12px", "important");
    modal.style.setProperty(
      "box-shadow",
      "0 24px 80px rgba(0, 0, 0, 0.28)",
      "important",
    );
    modal.style.setProperty("overflow", "hidden", "important");
    modal.style.setProperty(
      "border",
      "1px solid rgba(255, 255, 255, 0.4)",
      "important",
    );

    const header = document.createElement("div");

    header.style.setProperty("display", "flex", "important");
    header.style.setProperty("align-items", "center", "important");
    header.style.setProperty("justify-content", "space-between", "important");
    header.style.setProperty("gap", "12px", "important");
    header.style.setProperty("padding", "12px 16px", "important");
    header.style.setProperty("border-bottom", "1px solid #eaecf0", "important");
    header.style.setProperty("background", "#f9fafb", "important");

    const title = document.createElement("div");
    title.textContent = "Customer notes";

    title.style.setProperty("font-size", "14px", "important");
    title.style.setProperty("font-weight", "600", "important");
    title.style.setProperty("color", "#101828", "important");

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.textContent = "Save";
    saveButton.title = "Save notes";

    saveButton.style.setProperty("height", "30px", "important");
    saveButton.style.setProperty("padding", "0 12px", "important");
    saveButton.style.setProperty("border", "1px solid #1570ef", "important");
    saveButton.style.setProperty("border-radius", "6px", "important");
    saveButton.style.setProperty("background", "#1570ef", "important");
    saveButton.style.setProperty("color", "#ffffff", "important");
    saveButton.style.setProperty("font-size", "13px", "important");
    saveButton.style.setProperty("font-weight", "600", "important");
    saveButton.style.setProperty("line-height", "1", "important");
    saveButton.style.setProperty("cursor", "pointer", "important");

    const modalTextarea = document.createElement("textarea");
    modalTextarea.value = sourceTextarea.value || "";
    modalTextarea.placeholder = sourceTextarea.placeholder || "+ Add";

    modalTextarea.style.setProperty("flex", "1 1 auto", "important");
    modalTextarea.style.setProperty("width", "100%", "important");
    modalTextarea.style.setProperty("height", "100%", "important");
    modalTextarea.style.setProperty("min-height", "0", "important");
    modalTextarea.style.setProperty("padding", "16px", "important");
    modalTextarea.style.setProperty("border", "0", "important");
    modalTextarea.style.setProperty("outline", "none", "important");
    modalTextarea.style.setProperty("resize", "none", "important");
    modalTextarea.style.setProperty("box-sizing", "border-box", "important");
    modalTextarea.style.setProperty("overflow-y", "auto", "important");
    modalTextarea.style.setProperty("white-space", "pre-wrap", "important");
    modalTextarea.style.setProperty("overflow-wrap", "anywhere", "important");
    modalTextarea.style.setProperty("font-size", "14px", "important");
    modalTextarea.style.setProperty("line-height", "1.5", "important");
    modalTextarea.style.setProperty("font-family", "inherit", "important");
    modalTextarea.style.setProperty("color", "#101828", "important");
    modalTextarea.style.setProperty("background", "#ffffff", "important");

    header.appendChild(title);
    header.appendChild(saveButton);

    modal.appendChild(header);
    modal.appendChild(modalTextarea);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    saveButton.addEventListener("click", () => {
      closeModal({
        overlay,
        modalTextarea,
        sourceTextarea,
        shouldSave: true,
      });
    });

    overlay.addEventListener("mousedown", (event) => {
      if (event.target === overlay) {
        closeModal({
          overlay,
          modalTextarea,
          sourceTextarea,
          shouldSave: true,
        });
      }
    });

    modal.addEventListener("mousedown", (event) => {
      event.stopPropagation();
    });

    const handleEscape = (event) => {
      if (event.key === "Escape" && isModalOpen) {
        event.preventDefault();

        document.removeEventListener("keydown", handleEscape, true);

        closeModal({
          overlay,
          modalTextarea,
          sourceTextarea,
          shouldSave: true,
        });
      }
    };

    document.addEventListener("keydown", handleEscape, true);

    // Optional: live-sync while typing.
    // If this causes weird autosave behavior, comment out this block.
    // modalTextarea.addEventListener('input', () => {
    //  saveToGorgias(sourceTextarea, modalTextarea.value);
    // });

    setTimeout(() => {
      modalTextarea.focus();
      modalTextarea.selectionStart = modalTextarea.value.length;
      modalTextarea.selectionEnd = modalTextarea.value.length;
    }, 0);
  }

  function setupTextarea(textarea) {
    if (!textarea || textarea.dataset.gorgiasNotesModalSetup === "true") return;

    textarea.dataset.gorgiasNotesModalSetup = "true";
    lastTextarea = textarea;

    textarea.title = "Click to open customer notes editor";

    styleCollapsedField(textarea);

    textarea.addEventListener("mousedown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openModal(textarea);
    });

    textarea.addEventListener("focus", () => {
      openModal(textarea);
    });

    textarea.addEventListener("input", () => {
      queueStyleCollapsed(textarea);
    });

    textarea.addEventListener("change", () => {
      queueStyleCollapsed(textarea);
    });

    setTimeout(() => queueStyleCollapsed(textarea), 300);
    setTimeout(() => queueStyleCollapsed(textarea), 1000);
  }

  function scan() {
    const textarea = document.querySelector(SELECTOR);
    if (textarea) setupTextarea(textarea);
  }

  setTimeout(scan, 500);
  setTimeout(scan, 1500);
  setTimeout(scan, 3000);

  const observer = new MutationObserver(() => {
    if (resizeQueued) return;

    window.requestAnimationFrame(() => {
      scan();
      if (lastTextarea && !isModalOpen) queueStyleCollapsed(lastTextarea);
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  let lastUrl = location.href;

  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      lastTextarea = null;
      isModalOpen = false;

      document
        .querySelectorAll('[data-gorgias-notes-modal-overlay="true"]')
        .forEach((el) => el.remove());

      setTimeout(scan, 500);
      setTimeout(scan, 1500);
    }
  }, 1000);
})();
