#!/usr/bin/env bun

/**
 * Asset Compression Script
 * Compresses images in the assets folder using Bun + imagemin
 * 
 * Usage:
 *   bun scripts/compress-assets.ts            # Compress all images in assets/
 *   bun scripts/compress-assets.ts --staged   # Compress only staged images (for pre-commit)
 *   bun scripts/compress-assets.ts --help     # Show help
 */

import { execSync } from 'child_process';
import { existsSync, statSync, readdirSync } from 'fs';
import { join, dirname, relative, extname } from 'path';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';

const ASSETS_DIR = join(import.meta.dir, '..', 'assets');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// Aggressive compression settings
const COMPRESSION_QUALITY = 45; // 45% quality for maximum compression

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function getStagedImageFiles(): string[] {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf-8',
      cwd: dirname(ASSETS_DIR),
    });

    return output
      .trim()
      .split('\n')
      .filter((file) => {
        if (!file || !file.startsWith('assets/')) return false;
        const ext = extname(file).toLowerCase();
        return IMAGE_EXTENSIONS.includes(ext);
      })
      .map((file) => join(dirname(ASSETS_DIR), file));
  } catch (error) {
    return [];
  }
}

function getAllImageFiles(dir: string, files: string[] = []): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      getAllImageFiles(fullPath, files);
    } else if (IMAGE_EXTENSIONS.includes(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

interface CompressionResult {
  successCount: number;
  failCount: number;
  totalOriginal: number;
  totalCompressed: number;
  files: Array<{
    path: string;
    original: number;
    compressed: number;
    saved: number;
  }>;
}

async function compressImages(filePaths: string[]): Promise<CompressionResult> {
  if (filePaths.length === 0) {
    return { successCount: 0, failCount: 0, totalOriginal: 0, totalCompressed: 0, files: [] };
  }

  const results: CompressionResult = {
    successCount: 0,
    failCount: 0,
    totalOriginal: 0,
    totalCompressed: 0,
    files: [],
  };

  // Get original sizes before compression
  const originalSizes: Record<string, number> = {};
  for (const filePath of filePaths) {
    if (existsSync(filePath)) {
      originalSizes[filePath] = statSync(filePath).size;
    }
  }

  // Compress each file
  for (const filePath of filePaths) {
    const dir = dirname(filePath);
    const ext = extname(filePath).toLowerCase();

    try {
      const plugins = [];

      if (['.jpg', '.jpeg'].includes(ext)) {
        plugins.push(
          imageminMozjpeg({
            quality: COMPRESSION_QUALITY,
            progressive: true,
          })
        );
      }

      if (['.png'].includes(ext)) {
        plugins.push(
          imageminPngquant({
            quality: [0.3, 0.5],
            speed: 1,
          })
        );
      }

      if (plugins.length > 0) {
        await imagemin([filePath], {
          destination: dir,
          plugins: plugins as any,
        });
      }

      const originalSize = originalSizes[filePath] || 0;
      const compressedSize = statSync(filePath).size;
      const saved = originalSize - compressedSize;

      results.files.push({
        path: relative(ASSETS_DIR, filePath),
        original: originalSize,
        compressed: compressedSize,
        saved,
      });

      results.successCount++;
      results.totalOriginal += originalSize;
      results.totalCompressed += compressedSize;
    } catch (error) {
      console.error(`Error compressing ${filePath}:`, error instanceof Error ? error.message : String(error));
      results.failCount++;
    }
  }

  return results;
}

async function main() {
  const args = process.argv.slice(2);
  let filesToCompress: string[] = [];
  let mode: 'all' | 'staged' = 'all';

  if (args.includes('--help')) {
    console.log(`
Asset Compression Script

Usage:
  bun scripts/compress-assets.ts            Compress all images in assets/
  bun scripts/compress-assets.ts --staged   Compress only staged images (for pre-commit)
  bun scripts/compress-assets.ts --help     Show this help message

Configuration:
  - Quality: ${COMPRESSION_QUALITY}% (aggressive compression)
  - Formats: JPG, PNG, WebP
  - Tools: mozjpeg (JPG), pngquant (PNG)
  - Output: Overwrites originals with compressed versions
    `);
    process.exit(0);
  }

  if (!existsSync(ASSETS_DIR)) {
    console.log(`Assets directory not found: ${ASSETS_DIR}`);
    process.exit(1);
  }

  if (args.includes('--staged')) {
    mode = 'staged';
    filesToCompress = getStagedImageFiles();
  } else {
    filesToCompress = getAllImageFiles(ASSETS_DIR);
  }

  if (filesToCompress.length === 0) {
    if (mode !== 'staged') {
      console.log('No image files found in assets/');
    }
    process.exit(0);
  }

  console.log(`\n📦 Compressing ${filesToCompress.length} image(s) at ${COMPRESSION_QUALITY}% quality...\n`);

  const results = await compressImages(filesToCompress);

  if (results.successCount === 0) {
    if (mode !== 'staged') {
      console.log('No images were compressed');
    }
    process.exit(0);
  }

  console.log(`✅ Compression complete!\n`);
  console.log(`  Processed: ${results.successCount} file(s)`);
  console.log(`  Original size: ${formatBytes(results.totalOriginal)}`);
  console.log(`  Compressed size: ${formatBytes(results.totalCompressed)}`);

  const totalSaved = results.totalOriginal - results.totalCompressed;
  if (totalSaved > 0) {
    const percentSaved = ((totalSaved / results.totalOriginal) * 100).toFixed(1);
    console.log(`  💾 Saved: ${formatBytes(totalSaved)} (${percentSaved}%)`);
  }

  // Show per-file details
  console.log('\nDetailed breakdown:');
  results.files.forEach((file) => {
    const saved = file.original - file.compressed;
    const percent = file.original > 0 ? ((saved / file.original) * 100).toFixed(1) : '0';
    console.log(`  ${file.path}`);
    console.log(`    ${formatBytes(file.original)} → ${formatBytes(file.compressed)} (${percent}% saved)`);
  });

  if (results.failCount > 0) {
    console.log(`\n⚠️  ${results.failCount} file(s) failed to compress`);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
