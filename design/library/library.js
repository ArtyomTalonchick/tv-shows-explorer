// Loads the library into a page: tokens.json as CSS variables, and icons.svg as an inline sprite.
// Shared by the showcase and every mockup.
// Tokens: "{colors.ink.950}" references become var(--colors-ink-950); DEFAULT drops out of the name:
// --colors-bg, --colors-bg-subtle, --colors-accent-solid, --radii-md, --fontSizes-display.
// Icons: an svg.icon element with a use element pointing at href="#search". The sprite is inlined, so an icon
// does not depend on the sprite being loaded as a separate SVG document.
// fetch does not work from file://, so open the pages through a local server (see design/README.md).
// The body stays hidden until both are in: add class "tokens-pending" to <body>.
// Keep this file ASCII-only: VS Code Live Server miscounts multi-byte characters in what it serves.
(function () {
  const src = document.currentScript.src;

  function toCss(json) {
    const css = [];
    const ref = (v) => String(v).replace(/\{([^}]+)\}/g, (_, p) => `var(--${p.replace(/\./g, "-")})`);
    const walk = (node, path) => {
      if (node && typeof node === "object" && "value" in node) {
        css.push(`--${path.filter((p) => p !== "DEFAULT").join("-")}: ${ref(node.value)};`);
        return;
      }
      for (const [k, v] of Object.entries(node || {})) if (!k.startsWith("$")) walk(v, [...path, k]);
    };
    walk(json.tokens, []);
    walk(json.semanticTokens, []);
    return `:root { ${css.join(" ")} }`;
  }

  const tokens = fetch(new URL("../tokens.json", src)).then((r) => r.json());
  const icons = fetch(new URL("icons.svg", src)).then((r) => r.text());

  window.libraryReady = Promise.all([tokens, icons]).then(([json, sprite]) => {
    const style = document.createElement("style");
    style.textContent = toCss(json);
    document.head.prepend(style);
    const holder = document.createElement("div");
    holder.hidden = true;
    holder.innerHTML = sprite;
    document.body.prepend(holder);
    document.body.classList.remove("tokens-pending");
    return json;
  });
})();
