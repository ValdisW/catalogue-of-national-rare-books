/**
 * 验证请求
 */
import { getCipher } from '.';
import { sm3_encrypt } from './cipher';

const cipher = getCipher();

// 验证：时间戳是否在5分钟内
export function timestampCheck(timestamp: string): boolean {
  let now = new Date().getTime();
  return now - parseInt(timestamp) <= 300000;
}

// 验证：appKey
export function appKeyCheck(appKey): boolean {
  return appKey === 'gjzggjml';
}

// 验证：hashCode比对是否一致
export function hashCodeCheck(
  timestamp: string,
  hashCode: string,
  sm4Data: string,
): boolean {
  return hashCode === sm3_encrypt(sm4Data + timestamp + cipher);
}
