import CryptoJS from "crypto-js";

const KEYHEX = import.meta.env.VITE_KEYHEX;
const IVHEX = import.meta.env.VITE_IVHEX;

export function decrypt(encryptedHex) {
    if (!encryptedHex)
        return encryptedHex;
    try {
        const key = CryptoJS.enc.Hex.parse(KEYHEX);
        const iv = CryptoJS.enc.Hex.parse(IVHEX);
        const encrypted = CryptoJS.enc.Hex.parse(encryptedHex);

        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: encrypted },
            key,
            {
                iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            }
        );

        const plainText = decrypted.toString(CryptoJS.enc.Utf8);
        if (!plainText) throw new Error("Empty result");
        return plainText;
    } catch (err) {
        // console.error("Decryption failed:", err.message);
        return encryptedHex;
    }
}