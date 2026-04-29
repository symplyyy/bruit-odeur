import { toBlob } from "html-to-image";

async function prepareImages(node: HTMLElement): Promise<void> {
  const imgs = Array.from(node.querySelectorAll("img"));
  await Promise.all(
    imgs.map((img) => {
      const isExternal = /^https?:\/\//i.test(img.src);
      if (isExternal && img.crossOrigin !== "anonymous") {
        const src = img.src;
        img.crossOrigin = "anonymous";
        // Re-déclenche le chargement avec CORS
        img.src = "";
        img.src = src;
      }
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.addEventListener("load", () => resolve(), { once: true });
        img.addEventListener("error", () => resolve(), { once: true });
      });
    }),
  );
  await new Promise((r) => requestAnimationFrame(() => r(null)));
}

export async function exportStage(
  node: HTMLElement,
  width: number,
  height: number,
  filename: string,
  options: { pixelRatio?: number } = {},
): Promise<void> {
  const prevTransform = node.style.transform;
  const prevOrigin = node.style.transformOrigin;
  node.style.transform = "none";
  node.style.transformOrigin = "top left";

  try {
    await prepareImages(node);

    const blob = await toBlob(node, {
      fetchRequestInit: { mode: "cors", credentials: "omit" },
      width,
      height,
      canvasWidth: width,
      canvasHeight: height,
      pixelRatio: options.pixelRatio ?? 1,
      cacheBust: true,
      style: {
        transform: "none",
        transformOrigin: "top left",
      },
    });

    if (!blob) throw new Error("toBlob returned null");

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = filename;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } finally {
    node.style.transform = prevTransform;
    node.style.transformOrigin = prevOrigin;
  }
}
