import { expect, test } from '@playwright/test';

test('心情记录到成长记录主流程', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('例如：小晴').fill('小晴');
  await page.getByRole('button', { name: /进入我的小岛/ }).click();
  await page.getByRole('button', { name: /记录心情/ }).click();
  await page.getByRole('button', { name: /大风/ }).click();
  await page.getByLabel('情绪强度').fill('8');
  await page.getByRole('button', { name: /下一步/ }).click();
  await expect(page.getByText('情绪地图')).toBeVisible();
  await page.getByRole('button', { name: /生成心晴行动卡/ }).click();
  await expect(page.getByText('心晴行动卡')).toBeVisible();
  await page.getByRole('button', { name: /完成并保存/ }).click();
  await expect(page.getByText('我的心晴册')).toBeVisible();
});
