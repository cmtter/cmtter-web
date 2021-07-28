const readline = require('readline');
const path = require('path');
const fs = require('fs');

/**
 * 文件行解析器
 * @param {*} file 
 * @param {*} everyCb 
 */
export default function parse(file, everyCb) {
  if (!file) {
    return
  }
  const rd = readline.createInterface({
    input: fs.createReadStream(file)
  });
  const overFn = () => everyCb('', true);
  rd.on('line', everyCb).on('end', overFn).on('close', overFn).on('error', overFn)
}