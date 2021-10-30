import { makeCaptcha } from '../../deps.ts';


export function makeSvgCaptcha() {

  const captcha = makeCaptcha({
    charactersNumber: 6
  });

  return {
    text: captcha.text,
    svg: captcha.svgContext
  };

}
