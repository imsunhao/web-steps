import puppeteer from 'puppeteer-core'

const puppeteerOptions: puppeteer.LaunchOptions = process.env.CI
  ? { args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors'] }
  : { args: ['--ignore-certificate-errors'] }

puppeteerOptions.executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

export async function setupPuppeteer() {
  const browser = await puppeteer.launch(puppeteerOptions)
  const page = await browser.newPage()

  page.on('console', e => {
    if (e.type() === 'error') {
      console.error(`Error from Puppeteer-loaded page:\n`, e)
    }
  })

  async function click(selector: string, options?: puppeteer.ClickOptions) {
    await page.click(selector, options)
  }

  async function count(selector: string) {
    return (await page.$$(selector)).length
  }

  async function text(selector: string) {
    return await page.$eval(selector, node => node.textContent)
  }

  async function value(selector: string) {
    return await page.$eval(selector, (node: HTMLInputElement) => node.value)
  }

  async function html(selector: string) {
    return await page.$eval(selector, node => node.innerHTML)
  }

  async function classList(selector: string) {
    return await page.$eval(selector, (node: any) => [...node.classList])
  }

  async function children(selector: string) {
    return await page.$eval(selector, (node: any) => [...node.children])
  }

  async function isVisible(selector: string) {
    const display = await page.$eval(selector, (node: HTMLElement) => {
      return window.getComputedStyle(node).display
    })
    return display !== 'none'
  }

  async function isChecked(selector: string) {
    return await page.$eval(selector, (node: HTMLInputElement) => node.checked)
  }

  async function isFocused(selector: string) {
    return await page.$eval(selector, node => node === document.activeElement)
  }

  async function setValue(selector: string, value: string) {
    const el = await page.$(selector)
    if (el) {
      await el.evaluate((node: HTMLInputElement) => (node.value = ''))
      await el.type(value)
    }
  }

  async function enterValue(selector: string, value: string) {
    const el = await page.$(selector)
    if (el) {
      await el.evaluate((node: HTMLInputElement) => (node.value = ''))
      await el.type(value)
      await el.press('Enter')
    }
  }

  async function clearValue(selector: string) {
    return await page.$eval(selector, (node: HTMLInputElement) => (node.value = ''))
  }

  async function destroy() {
    await browser.close()
  }

  return {
    page,
    destroy,
    click,
    count,
    text,
    value,
    html,
    classList,
    children,
    isVisible,
    isChecked,
    isFocused,
    setValue,
    enterValue,
    clearValue
  }
}
