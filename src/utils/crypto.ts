import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import { config } from "../config";

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const encrypt = (data: any) => {
  const key = CryptoJS.enc.Utf8.parse(config.CRYPTO_JS_KEY);
  const iv = CryptoJS.enc.Utf8.parse(config.CRYPTO_JS_IV);

  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
    keySize: 128 / 8,
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();

  return encrypted;
};

export const decrypt = function (encryptedData: any) {
  const Key = CryptoJS.enc.Utf8.parse(config.CRYPTO_JS_KEY);
  const IV = CryptoJS.enc.Utf8.parse(config.CRYPTO_JS_IV);

  const decryptedText = CryptoJS.AES.decrypt(encryptedData, Key, {
    keySize: 128 / 8,
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return JSON.parse(decryptedText.toString(CryptoJS.enc.Utf8));
};
