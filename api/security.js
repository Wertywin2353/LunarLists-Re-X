const enc = new TextEncoder();
const dec = new TextDecoder();

// === КАСТОМНЫЕ ФУНКЦИИ BASE64 (без atob/btoa) ===
const b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function bytesToBase64(bytes) {
    let result = '';
    const len = bytes.length;
    for (let i = 0; i < len; i += 3) {
        const b1 = bytes[i];
        const b2 = i + 1 < len ? bytes[i + 1] : 0;
        const b3 = i + 2 < len ? bytes[i + 2] : 0;

        const c1 = b1 >> 2;
        const c2 = ((b1 & 3) << 4) | (b2 >> 4);
        const c3 = ((b2 & 15) << 2) | (b3 >> 6);
        const c4 = b3 & 63;

        result += b64chars[c1] + b64chars[c2];
        result += i + 1 < len ? b64chars[c3] : '=';
        result += i + 2 < len ? b64chars[c4] : '=';
    }
    return result;
}

function base64ToBytes(str) {
    // Убираем символы отступа (=)
    const base64 = str.replace(/=+$/, '');
    const len = base64.length;
    const bytes = new Uint8Array((len * 3) / 4);

    let p = 0;
    for (let i = 0; i < len; i += 4) {
        const c1 = b64chars.indexOf(base64[i]);
        const c2 = b64chars.indexOf(base64[i + 1]);
        const c3 = i + 2 < len ? b64chars.indexOf(base64[i + 2]) : 0;
        const c4 = i + 3 < len ? b64chars.indexOf(base64[i + 3]) : 0;

        bytes[p++] = (c1 << 2) | (c2 >> 4);
        if (i + 2 < len) bytes[p++] = ((c2 & 15) << 4) | (c3 >> 2);
        if (i + 3 < len) bytes[p++] = ((c3 & 3) << 6) | c4;
    }
    
    // Возвращаем только заполненную часть массива
    return bytes.slice(0, p);
}

// === КРИПТОГРАФИЯ ===

async function getPasswordKey(password) {
    return window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );
}

async function deriveKey(passwordKey, salt) {
    return window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        passwordKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

// === ФУНКЦИЯ ШИФРОВАНИЯ ===
async function encryptAES(text, password) {
    try {
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const iv = window.crypto.getRandomValues(new Uint8Array(12));

        const passwordKey = await getPasswordKey(password);
        const aesKey = await deriveKey(passwordKey, salt);

        // TextEncoder берет на себя конвертацию любых символов (в т.ч. кириллицы/эмодзи) в правильные байты
        const encryptedContent = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            aesKey,
            enc.encode(text) 
        );

        const encryptedContentArr = new Uint8Array(encryptedContent);
        const buffer = new Uint8Array(salt.byteLength + iv.byteLength + encryptedContentArr.byteLength);
        
        buffer.set(salt, 0);
        buffer.set(iv, salt.byteLength);
        buffer.set(encryptedContentArr, salt.byteLength + iv.byteLength);

        // Используем нашу прямую байтовую конвертацию
        return bytesToBase64(buffer);
    } catch (e) {
        console.error("Encryption failed:", e);
        throw e;
    }
}

// === ФУНКЦИЯ ДЕШИФРОВАНИЯ ===
async function decryptAES(encryptedBase64, password) {
    try {
        // Конвертируем Base64 в байты напрямую
        const buffer = base64ToBytes(encryptedBase64);

        const salt = buffer.slice(0, 16);
        const iv = buffer.slice(16, 28);
        const data = buffer.slice(28);

        const passwordKey = await getPasswordKey(password);
        const aesKey = await deriveKey(passwordKey, salt);

        const decryptedContent = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            aesKey,
            data
        );

        // TextDecoder превращает байты обратно в UTF-8 строку
        return dec.decode(decryptedContent);
    } catch (e) {
        console.error("Decryption failed (wrong password or corrupted data):", e);
        throw e;
    }
}