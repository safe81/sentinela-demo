// Generates PNG icons using only Node.js built-ins (no dependencies)
// Creates valid PNG files with the Sentinela shield colours

const fs = require('fs');
const path = require('path');

// Minimal PNG encoder (pure Node.js, no deps)
const zlib = require('zlib');

function createPNG(width, height, drawFn) {
  const pixels = new Uint8Array(width * height * 4);

  const setPixel = (x, y, r, g, b, a = 255) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const i = (y * width + x) * 4;
    pixels[i] = r; pixels[i+1] = g; pixels[i+2] = b; pixels[i+3] = a;
  };

  const fillRect = (x0, y0, x1, y1, r, g, b, a = 255) => {
    for (let y = Math.max(0, y0); y < Math.min(height, y1); y++)
      for (let x = Math.max(0, x0); x < Math.min(width, x1); x++)
        setPixel(x, y, r, g, b, a);
  };

  const fillCircle = (cx, cy, radius, r, g, b, a = 255) => {
    for (let y = cy - radius; y <= cy + radius; y++)
      for (let x = cx - radius; x <= cx + radius; x++)
        if ((x-cx)**2 + (y-cy)**2 <= radius**2)
          setPixel(x, y, r, g, b, a);
  };

  // Anti-aliased circle
  const circle = (cx, cy, radius, r, g, b) => {
    for (let y = cy - radius - 1; y <= cy + radius + 1; y++) {
      for (let x = cx - radius - 1; x <= cx + radius + 1; x++) {
        const d = Math.sqrt((x-cx)**2 + (y-cy)**2);
        const alpha = Math.max(0, Math.min(255, (radius + 0.5 - d) * 255));
        if (alpha > 0) setPixel(x, y, r, g, b, alpha);
      }
    }
  };

  drawFn({ width, height, setPixel, fillRect, fillCircle, circle });

  // Build PNG
  const crc32 = (() => {
    const t = new Int32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      t[i] = c;
    }
    return (buf, offset = 0, len = buf.length) => {
      let c = -1;
      for (let i = offset; i < offset + len; i++) c = t[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
      return (c ^ -1) >>> 0;
    };
  })();

  const write4 = (buf, offset, val) => {
    buf[offset]   = (val >>> 24) & 0xFF;
    buf[offset+1] = (val >>> 16) & 0xFF;
    buf[offset+2] = (val >>> 8)  & 0xFF;
    buf[offset+3] =  val         & 0xFF;
  };

  const chunk = (type, data) => {
    const typeBytes = Buffer.from(type, 'ascii');
    const buf = Buffer.alloc(12 + data.length);
    write4(buf, 0, data.length);
    typeBytes.copy(buf, 4);
    data.copy(buf, 8);
    write4(buf, 8 + data.length, crc32(buf, 4, 4 + data.length));
    return buf;
  };

  // IHDR
  const ihdr = Buffer.alloc(13);
  write4(ihdr, 0, width); write4(ihdr, 4, height);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA

  // Raw image data (filter byte 0 per row)
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter type None
    for (let x = 0; x < width; x++) {
      const src = (y * width + x) * 4;
      const dst = y * (width * 4 + 1) + 1 + x * 4;
      raw[dst]   = pixels[src];
      raw[dst+1] = pixels[src+1];
      raw[dst+2] = pixels[src+2];
      raw[dst+3] = pixels[src+3];
    }
  }

  const compressed = zlib.deflateSync(raw, { level: 6 });

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function drawIcon(size) {
  return createPNG(size, size, ({ width, height, fillRect, fillCircle, circle, setPixel }) => {
    const s = size / 96; // scale factor (design is 96x96)

    // Background circle — dark green
    fillCircle(size/2, size/2, size/2, 15, 42, 32, 255);

    // Shield body — gradient approximated as two rects
    const sx = Math.round(18 * s), sy = Math.round(10 * s);
    const sw = Math.round(60 * s), sh = Math.round(72 * s);

    // Shield top (lighter green)
    for (let y = sy; y < sy + sh/2; y++) {
      const progress = (y - sy) / (sh / 2);
      const r = Math.round(42 + (15 - 42) * progress);
      const g = Math.round(96 + (42 - 96) * progress);
      const b = Math.round(72 + (32 - 72) * progress);
      for (let x = sx; x < sx + sw; x++) setPixel(x, y, r, g, b, 255);
    }
    // Shield bottom (dark green)
    for (let y = sy + Math.round(sh/2); y < sy + sh; y++) {
      for (let x = sx; x < sx + sw; x++) setPixel(x, y, 15, 42, 32, 255);
    }

    // Gold horizontal bar
    const barY = Math.round(44 * s), barH = Math.round(10 * s);
    for (let y = barY; y < barY + barH; y++)
      for (let x = sx; x < sx + sw; x++) setPixel(x, y, 201, 162, 75, 255);

    // White star (simplified as cross + diagonals)
    const cx = Math.round(size / 2), cy = Math.round(32 * s);
    const r2 = Math.round(8 * s);
    fillCircle(cx, cy, r2, 255, 255, 255, 255);
    // Star points
    fillRect(cx - 1, cy - r2 - Math.round(4*s), cx + 1, cy + r2 + Math.round(4*s), 255, 255, 255);
    fillRect(cx - r2 - Math.round(4*s), cy - 1, cx + r2 + Math.round(4*s), cy + 1, 255, 255, 255);
  });
}

// Generate icons
const sizes = [180, 192, 512];
const dir = path.join(__dirname, 'assets');

for (const size of sizes) {
  const png = drawIcon(size);
  const file = path.join(dir, `icon-${size}.png`);
  fs.writeFileSync(file, png);
  console.log(`  ✓  icon-${size}.png  (${(png.length/1024).toFixed(1)} KB)`);
}

console.log('\nPronto. Actualiza o manifest.json para usar estes ícones.\n');
