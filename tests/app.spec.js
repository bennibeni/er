import { test, expect } from "@playwright/test";

test("branding, graph, scenarios, treatments and arrest", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveTitle("ER · Turno di guardia");
  const icon = page.locator('link[rel="icon"]');
  const iconResponse = await page.request.get(await icon.getAttribute("href"));
  expect(await iconResponse.text()).toContain("🫀");
  await expect(page.locator(".react-flow__node")).toHaveCount(9);
  await page.getByRole("button", { name: /Sforzo/ }).click();
  await expect(page.getByText("140 BPM")).toBeVisible();
  await page.getByRole("checkbox", { name: /Emorragia/ }).check();
  await expect(page.getByText("65%", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /Sforzo/ })).toBeDisabled();
  await page.getByRole("button", { name: /Sacca di Sangue/ }).click();
  await expect(page.getByText("95%", { exact: true })).toBeVisible();
  await expect(page.getByText("60 BPM")).toBeVisible();
  await page.getByRole("checkbox", { name: /Emorragia/ }).uncheck();
  await expect(page.getByText("100%", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Sacca di Sangue/ }),
  ).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("checkbox", { name: /Amputazione/ }).check();
  await expect(page.locator(".react-flow__node")).toHaveCount(8);
  await page.getByRole("checkbox", { name: /Amputazione/ }).uncheck();
  await expect(page.locator(".react-flow__node")).toHaveCount(9);
  await page.locator('.react-flow__node[data-id="Reni"]').click();
  await expect(
    page.getByRole("heading", { name: "Reni (Filtrazione)" }),
  ).toBeVisible();
  await page.keyboard.press("Delete");
  await expect(page.locator(".react-flow__node")).toHaveCount(9);
  await page.getByRole("checkbox", { name: /Embolia/ }).check();
  await expect(page.getByText("50%", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Terapia Trombolitica/ }).click();
  await expect(page.getByText("95%", { exact: true })).toBeVisible();
  await page.getByRole("checkbox", { name: /Embolia/ }).uncheck();
  await page.getByRole("checkbox", { name: /Infarto/ }).check();
  await expect(page.getByText("72%", { exact: true })).toBeVisible();
  await page.getByRole("checkbox", { name: /Emorragia/ }).check();
  await expect(page.getByText("0 BPM")).toBeVisible();
  for (const button of await page.locator(".pannello-cure button").all())
    await expect(button).toBeDisabled();
  expect(errors).toEqual([]);
});

test("responsive layout and background", async ({ page }) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator(".react-flow__node")).toHaveCount(9);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const bg = await page
      .locator(".contenitore-gioco-er")
      .evaluate((e) => getComputedStyle(e, "::before").opacity);
    expect(bg).toBe("0.22");
  }
  expect(
    (await page.request.get("/backgrounds/sala-operatoria.jpeg")).ok(),
  ).toBe(true);
});

test("local details update with treatment and unnecessary transfusion has a cost", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("checkbox", { name: /Embolia/ }).check();
  await page.locator('.react-flow__node[data-id="Polmoni"]').click();
  await expect(
    page.getByText("Scambio compromesso nel modello", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Terapia Trombolitica/ }).click();
  await expect(
    page.getByText("Scambio in recupero nel modello", { exact: false }),
  ).toBeVisible();
  await page.getByRole("checkbox", { name: /Embolia/ }).uncheck();
  await page.getByRole("button", { name: /Sacca di Sangue/ }).click();
  await expect(page.getByText("75%", { exact: true })).toBeVisible();
  await expect(page.getByText(/SOVRACCARICO SIMULATO:/)).toBeVisible();
});

test("audio follows displayed BPM, can be muted, and handles arrest and navigation", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.audioEvents = [];
    const Native = window.AudioContext;
    window.AudioContext = class extends Native {
      createOscillator() {
        const osc = super.createOscillator();
        const start = osc.start.bind(osc);
        let hz;
        const setFrequency = osc.frequency.setValueAtTime.bind(osc.frequency);
        osc.frequency.setValueAtTime = (value, time) => {
          hz = value;
          return setFrequency(value, time);
        };
        osc.start = (...args) => {
          window.audioEvents.push({ t: performance.now(), hz });
          start(...args);
        };
        return osc;
      }
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Attiva audio", exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () => window.audioEvents.filter((e) => e.hz === 880).length,
      ),
    )
    .toBeGreaterThanOrEqual(3);
  const beats = await page.evaluate(() =>
    window.audioEvents.filter((e) => e.hz === 880),
  );
  for (let i = 1; i < beats.length; i++)
    expect(beats[i].t - beats[i - 1].t).toBeGreaterThan(800);
  for (let i = 1; i < beats.length; i++)
    expect(beats[i].t - beats[i - 1].t).toBeLessThan(1200);
  await page.getByRole("button", { name: /Sforzo/ }).click();
  await expect(page.getByText("140 BPM")).toBeVisible();
  await page.evaluate(() => {
    window.audioEvents = [];
  });
  await expect
    .poll(() => page.evaluate(() => window.audioEvents.length))
    .toBeGreaterThanOrEqual(3);
  const veloci = await page.evaluate(() => window.audioEvents);
  for (let i = 1; i < veloci.length; i++) {
    expect(veloci[i].t - veloci[i - 1].t).toBeGreaterThan(300);
    expect(veloci[i].t - veloci[i - 1].t).toBeLessThan(600);
  }
  await page
    .getByRole("button", { name: "Disattiva audio", exact: true })
    .click();
  const count = await page.evaluate(() => window.audioEvents.length);
  await page.waitForTimeout(1200);
  expect(await page.evaluate(() => window.audioEvents.length)).toBe(count);
  await page.getByRole("checkbox", { name: /Emorragia/ }).check();
  await page.getByRole("checkbox", { name: /Infarto/ }).check();
  await page.getByRole("button", { name: "Attiva audio", exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () => window.audioEvents.filter((e) => e.hz === 540).length,
      ),
    )
    .toBe(1);
  await page.getByRole("checkbox", { name: /Infarto/ }).uncheck();
  await expect(page.getByText("120 BPM")).toBeVisible();
  await page.screenshot({
    path: "test-results/er-monitor.png",
    fullPage: true,
  });
  await page.goto("/non-esiste");
  await expect(page.getByText("404", { exact: true })).toBeVisible();
});
