function updateState(mutator) {
  if (typeof mutator === "function") {
    mutator(window.S);
  }
  if (typeof window.saveLocal === "function") {
    window.saveLocal();
  }
}

if (typeof window !== "undefined") {
  window.ASCore = window.ASCore || {};
  window.ASCore.state = { updateState };
}
