// Loads a classic <script src> once and resolves when it has run (cached per src).
// Used for the colour picker's jQuery chain, which must load in a fixed order.

const loaded = new Map<string, Promise<void>>();

export function loadScript(src: string): Promise<void> {
  let request = loaded.get(src);
  if (!request) {
    request = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.onload = () => resolve();
      script.onerror = () => {
        loaded.delete(src);
        reject(new Error(`Could not load ${src}`));
      };
      document.body.appendChild(script);
    });
    loaded.set(src, request);
  }
  return request;
}
