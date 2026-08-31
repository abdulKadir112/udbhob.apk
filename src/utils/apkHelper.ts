/**
 * Utility functions for Google Drive APK Direct Download Conversion & Installation Guides
 */

/**
 * Extracts Google Drive File ID from various link formats:
 * - https://drive.google.com/file/d/1ABC123xyz/view?usp=sharing
 * - https://drive.google.com/open?id=1ABC123xyz
 * - https://drive.google.com/uc?id=1ABC123xyz&export=download
 * - https://drive.google.com/uc?export=download&id=1ABC123xyz
 */
export function extractGoogleDriveFileId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;

  const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return fileDMatch[1];
  }

  const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    return idParamMatch[1];
  }

  const openIdMatch = url.match(/\/open\?id=([a-zA-Z0-9_-]+)/);
  if (openIdMatch && openIdMatch[1]) {
    return openIdMatch[1];
  }

  return null;
}

/**
 * Converts any Google Drive share link into a direct high-speed download link.
 * If not Google Drive, returns the original link.
 */
export function getDirectApkDownloadUrl(rawUrl: string): string {
  if (!rawUrl || !rawUrl.trim()) return '';

  const cleanUrl = rawUrl.trim();
  const fileId = extractGoogleDriveFileId(cleanUrl);

  if (fileId) {
    // Direct Google Drive download endpoint with confirm bypass
    return `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
  }

  return cleanUrl;
}

const DEFAULT_APK_KEY = 'probashi_fund_apk_link';

/**
 * Get configured APK link
 */
export function getConfiguredApkUrl(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(DEFAULT_APK_KEY);
    if (saved && saved.trim()) return saved.trim();
  }
  // Default fallback or empty
  return '';
}

/**
 * Save configured APK link
 */
export function setConfiguredApkUrl(url: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DEFAULT_APK_KEY, url.trim());
  }
}
