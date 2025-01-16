import CryptoJS from "crypto-js";

const secretKey = "12345678901234567890123456789012"; // 32-byte key
const iv = CryptoJS.enc.Utf8.parse("1234567890123456"); // 16-byte IV

// Encrypt data
export const encryptData = (data) => {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(secretKey), {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

// Decrypt data
export const decryptData = (ciphertext) => {
  const decrypted = CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(secretKey), {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
};
