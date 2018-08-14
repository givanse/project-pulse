// integer padding
export default function ipad(params) {
  let str = '' + params[0];
  const width = params[1];

  const total = width - str.length;
  let padding = '';
  for (let i = 0; i < total; i++) {
    padding += ' ';
  }

  return padding + str;
}
