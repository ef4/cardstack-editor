export function encode(body) {
  return Object.keys(body).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(body[key])}`).join('&');
}

export function decode(body) {
  let output = {};
  body.split('&').map(pair => pair.split('=').map(decodeURIComponent)).forEach(([k,v]) => output[k] = v);
  return output;
}

export const contentType = 'application/x-www-form-urlencoded';
