// src/polyfills.js
// Import this file at the very top of your main.jsx or index.js file

// Handle missing process
if (typeof window !== "undefined" && !window.process) {
  window.process = {
    env: {},
    browser: true,
    version: "",
    versions: {},
    nextTick: function (fn) {
      setTimeout(fn, 0);
    },
  };
}

// Handle missing global
if (typeof window !== "undefined" && !window.global) {
  window.global = window;
}

// Handle missing Buffer
if (typeof window !== "undefined" && !window.Buffer) {
  window.Buffer = {
    isBuffer: () => false,
    from: () => ({}),
  };
}
