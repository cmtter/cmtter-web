export default function objectProperty(obj, keys, defaultValue) {
  let res = null
  keys.split('.').forEach((k, i, arr) => {
    res = (i <= arr.length && obj) ? (obj = obj[k]) : null
  });
  return res || defaultValue
}