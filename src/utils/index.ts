export function cloneAndRemoveString(target:string, arr:string[]):string[] {
  const newArr = [];
  for (const strB of arr) {
    if (strB !== target) {
      newArr.push(strB);
    }
  }
  return newArr;
}