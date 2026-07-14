const TARGET_BYTES = 7.5 * 1024 * 1024;
const HARD_MAX_BYTES = 8 * 1024 * 1024;

const SERVER_OK = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(
        new Error(
          "No se pudo leer la imagen. Si es HEIC, cambia el formato a JPG en el teléfono.",
        ),
      );
    };
    img.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("No se pudo comprimir la imagen"));
          return;
        }
        resolve(blob);
      },
      type,
      quality,
    );
  });
}

/**
 * Accepts large phone photos and compresses/converts to JPEG under 8 MB.
 */
export async function compressImageForUpload(file: File): Promise<File> {
  const mime = (file.type || "").toLowerCase();
  const alreadyOk =
    file.size > 0 &&
    file.size <= HARD_MAX_BYTES &&
    SERVER_OK.has(mime);

  if (alreadyOk) return file;

  const img = await loadImage(file);
  let maxEdge = 2400;
  let quality = 0.85;
  let blob: Blob | null = null;

  for (let attempt = 0; attempt < 12; attempt++) {
    const scale = Math.min(1, maxEdge / Math.max(img.width, img.height, 1));
    const width = Math.max(1, Math.round(img.width * scale));
    const height = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No se pudo procesar la imagen");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    blob = await canvasToBlob(canvas, "image/jpeg", quality);
    if (blob.size <= TARGET_BYTES) break;

    if (quality > 0.4) {
      quality = Math.round((quality - 0.1) * 100) / 100;
    } else {
      maxEdge = Math.max(800, Math.round(maxEdge * 0.7));
      quality = 0.72;
    }
  }

  if (!blob || blob.size > HARD_MAX_BYTES) {
    throw new Error(
      "No se pudo comprimir la imagen bajo 8 MB. Prueba otra foto.",
    );
  }

  const base = file.name.replace(/\.[^.]+$/, "") || `producto-${Date.now()}`;
  return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
}
