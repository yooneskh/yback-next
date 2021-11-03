
export function makeSvgCaptcha() {

  const captcha = {
    text: '123456',
    svgContext: `<svg viewBox="0 0 200 44"><text x="55" y="20">123456</text></svg>`
  }

  return {
    text: captcha.text,
    svg: captcha.svgContext
  };

}
