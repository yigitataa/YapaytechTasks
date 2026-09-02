import { describe, expect, it, vi } from 'vitest';
import type { BrowserAdapter, BrowserLauncher } from '../src/services/brand-catalog/live-source.js';
import {
  ARABAM_ORIGIN,
  PuppeteerVehicleDetailsSource,
} from '../src/services/vehicle-details/index.js';

const detailHtml = `
  <main class="vehicle-detail">
    <section class="detail-section"><h2>Motor</h2><dl><dt>Güç</dt><dd>150 HP</dd></dl></section>
    <img src="/raw-car.jpg">
  </main>
`;

function createBrowser(status = 200, html = detailHtml) {
  const close = vi.fn(async () => undefined);
  const goto = vi.fn(async () => ({ status: () => status }));
  const browser: BrowserAdapter = {
    close,
    newPage: vi.fn(async () => ({
      setDefaultNavigationTimeout: vi.fn(),
      setDefaultTimeout: vi.fn(),
      goto,
      waitForSelector: vi.fn(async () => undefined),
      content: vi.fn(async () => html),
    })),
  };
  return { browser, close, goto };
}

describe('PuppeteerVehicleDetailsSource', () => {
  it('doğrulanmış relative ilan yolunu sabit Arabam origin ile açar', async () => {
    const { browser, close, goto } = createBrowser();
    const launchBrowser: BrowserLauncher = vi.fn(async () => browser);
    const source = new PuppeteerVehicleDetailsSource({ timeoutMs: 2_500, launchBrowser });

    const result = await source.fetchDetails('/ilan/ham-ilan/123?ref=liste');

    expect(goto).toHaveBeenCalledWith(`${ARABAM_ORIGIN}/ilan/ham-ilan/123?ref=liste`, {
      waitUntil: 'domcontentloaded',
      timeout: 2_500,
    });
    expect(result.sections[0]?.fields).toContainEqual({ label: 'Güç', value: '150 HP' });
    expect(result.images).toEqual(['/raw-car.jpg']);
    expect(close).toHaveBeenCalledOnce();
  });

  it('geçersiz link için tarayıcı başlatmaz', async () => {
    const launchBrowser: BrowserLauncher = vi.fn();
    const source = new PuppeteerVehicleDetailsSource({ launchBrowser });

    await expect(source.fetchDetails('/ilan/../hesabim')).rejects.toThrow();
    expect(launchBrowser).not.toHaveBeenCalled();
  });

  it.each([
    [403, detailHtml],
    [200, '<title>Just a moment...</title><main><form id="challenge-form"></form></main>'],
  ])('HTTP/challenge hatasında tarayıcıyı kapatır', async (status, html) => {
    const { browser, close } = createBrowser(status, html);
    const source = new PuppeteerVehicleDetailsSource({
      launchBrowser: vi.fn(async () => browser),
    });

    await expect(source.fetchDetails('/ilan/ham-ilan/123')).rejects.toThrow();
    expect(close).toHaveBeenCalledOnce();
  });
});
