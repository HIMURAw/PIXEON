declare module "svg-captcha" {
  export interface Config {
    size?: number;
    width?: number;
    height?: number;
    fontSize?: number;
    color?: boolean;
    background?: string;
    noise?: number;
    charPreset?: string;
  }
  export interface CaptchaObj {
    data: string;
    text: string;
  }
  export function create(config?: Config): CaptchaObj;
  export function createMathExpr(config?: Config): CaptchaObj;
}
