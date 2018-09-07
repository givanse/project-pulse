// integer padding
export default function ipad(params) {
  const int: number = params[0];
  if (!int) {
    return 0;
  }

  let str = int.toLocaleString('en', {useGrouping: true});
  const width = params[1];

  const total = width - str.length;
  let padding = '';
  for (let i = 0; i < total; i++) {
    // TODO: padding += '&nbsp;';
    padding += ' ';
  }

  return padding + str;
}
