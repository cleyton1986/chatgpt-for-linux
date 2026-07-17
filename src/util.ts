import { app, nativeImage, NativeImage } from "electron";
import fs from "fs";
import path from "path";

/**
 * Procura o ícone com o nome especificado nos diretórios de dados.
 * @param name Nome do ícone (ex.: "chatgpt-for-linux.png")
 * @returns Objeto nativeImage criado a partir do caminho encontrado.
 */
export function findIcon(name: string) {
  let iconPath = fromDataDirs("icons/hicolor/512x512/apps/" + name);

  if (iconPath === null) {
    // Em producao (AppImage): extraFiles ficam na raiz do app (ao lado de resources/)
    if (app.isPackaged) {
      iconPath = path.join(process.resourcesPath, "..", "data/icons/hicolor/512x512/apps/", name);
    } else {
      iconPath = path.join(__dirname, "..", "data/icons/hicolor/512x512/apps/", name);
    }
  }

  return nativeImage.createFromPath(iconPath);
}

/**
 * Procura o caminho do ícone nos diretórios especificados na variável de ambiente XDG_DATA_DIRS.
 * @param iconPath Caminho relativo do ícone.
 * @returns Caminho completo do ícone, se encontrado.
 */
function fromDataDirs(iconPath: string) {
  for (const dataDir of (process.env.XDG_DATA_DIRS || "").split(":")) {
    if (!dataDir) continue;
    const fullPath = path.join(dataDir, iconPath);
    if (fs.existsSync(fullPath)) return fullPath;
  }
  return null;
}

/**
 * Retorna a versão atual do aplicativo.
 * @returns Versão do aplicativo.
 */
export function getAppVersion() {
  return app.getVersion();
}

/**
 * Retinge um icone monocromatico (arte preta sobre fundo transparente) com a
 * cor solicitada, preservando o canal alpha original (incluindo antialiasing
 * das bordas). Nao depende de libs externas: opera direto no bitmap BGRA.
 * @param image Icone original (preto sobre transparente).
 * @param hex Cor no formato "#rrggbb".
 */
export function recolorIcon(image: NativeImage, hex: string): NativeImage {
  const { r, g, b } = hexToRgb(hex);
  const size = image.getSize();
  const bitmap = Buffer.from(image.toBitmap()); // formato BGRA

  for (let i = 0; i < bitmap.length; i += 4) {
    if (bitmap[i + 3] === 0) continue; // pixel totalmente transparente, nao mexe
    bitmap[i] = b;
    bitmap[i + 1] = g;
    bitmap[i + 2] = r;
    // alpha (bitmap[i + 3]) preservado
  }

  return nativeImage.createFromBitmap(bitmap, size);
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

export type IconBgShape = "none" | "square" | "circle";

export interface IconStyle {
  fgColor: string | null;
  bgColor: string | null;
  bgShape: IconBgShape;
}

/**
 * Monta o icone final da tray: cor do traço (fgColor) + fundo opcional
 * (quadrado ou redondo, com cor propria). Sem fundo, retorna so o traço
 * retingido sobre transparencia (comportamento anterior).
 */
export function buildStyledIcon(base: NativeImage, style: IconStyle): NativeImage {
  const foreground = style.fgColor ? recolorIcon(base, style.fgColor) : base;

  if (style.bgShape === "none" || !style.bgColor) {
    return foreground;
  }

  return compositeOnBackground(foreground, style.bgColor, style.bgShape);
}

/**
 * Desenha um fundo solido (quadrado ou circulo) do tamanho do canvas e
 * sobrepoe o traço (encolhido e centralizado, pra sobrar respiro) por cima
 * usando alpha blending "source-over" manual.
 */
function compositeOnBackground(
  foreground: NativeImage,
  bgHex: string,
  shape: IconBgShape
): NativeImage {
  const { width, height } = foreground.getSize();
  const bg = hexToRgb(bgHex);

  // Encolhe o traço para caber com respiro dentro do fundo
  const scale = 0.72;
  const fgW = Math.round(width * scale);
  const fgH = Math.round(height * scale);
  const offsetX = Math.round((width - fgW) / 2);
  const offsetY = Math.round((height - fgH) / 2);
  const scaledFg = foreground.resize({ width: fgW, height: fgH, quality: "best" });
  const fgBitmap = scaledFg.toBitmap(); // BGRA

  const out = Buffer.alloc(width * height * 4);
  const radius = width / 2;
  const cx = width / 2;
  const cy = height / 2;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      let insideBg = true;
      if (shape === "circle") {
        const dx = x - cx + 0.5;
        const dy = y - cy + 0.5;
        insideBg = dx * dx + dy * dy <= radius * radius;
      }

      let outB = 0, outG = 0, outR = 0, outA = 0;
      if (insideBg) {
        outB = bg.b;
        outG = bg.g;
        outR = bg.r;
        outA = 255;
      }

      // Sobrepoe o traço (se o pixel atual cair dentro da area encolhida)
      const fx = x - offsetX;
      const fy = y - offsetY;
      if (fx >= 0 && fx < fgW && fy >= 0 && fy < fgH) {
        const fi = (fy * fgW + fx) * 4;
        const fgA = fgBitmap[fi + 3];
        if (fgA > 0) {
          const fgB = fgBitmap[fi];
          const fgG = fgBitmap[fi + 1];
          const fgR = fgBitmap[fi + 2];
          const invA = 255 - fgA;
          outB = Math.round((fgB * fgA + outB * invA) / 255);
          outG = Math.round((fgG * fgA + outG * invA) / 255);
          outR = Math.round((fgR * fgA + outR * invA) / 255);
          outA = Math.round(fgA + (outA * invA) / 255);
        }
      }

      out[idx] = outB;
      out[idx + 1] = outG;
      out[idx + 2] = outR;
      out[idx + 3] = outA;
    }
  }

  return nativeImage.createFromBitmap(out, { width, height });
}
