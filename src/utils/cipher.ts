import { getCipher } from '.';

/**
 * 国密相关
 */
import { SM3, SM4 } from 'gm-crypto';

const cipher = getCipher();
const key = Buffer.from(cipher, 'utf8').toString('hex');

// SM4加密
export function sm4_encrypt(src_str: string) {
  return SM4.encrypt(src_str, key, {
    inputEncoding: 'utf8',
    outputEncoding: 'hex',
  });
}

// SM4解密
export function sm4_decrypt(e) {
  return SM4.decrypt(e, key, {
    inputEncoding: 'hex',
    outputEncoding: 'utf8',
  });
}

// SM3加密
export function sm3_encrypt(src_str: string) {
  const encrypted_sm3 = SM3.digest(src_str, 'utf-8');
  const hex = Array.from(new Uint8Array(encrypted_sm3))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hex; // 小写字母
}
