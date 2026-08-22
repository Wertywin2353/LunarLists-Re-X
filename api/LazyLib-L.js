// Lazy Lib LITE By Wertywin2353
// v1.0.2 For JS
// Non-commercial use! Only for personal usage. Ясно?
// Created in 2024, Ye. (Rel 2026.07)


// values for lib
const url = new URL(window.location);

// input hash name (on HashName).
function GetReqData(HashName) {
    let x = url.searchParams.get(HashName);
    return x;
}

// Get an Cookie Tip - let value = getC("value");
function getC(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

// Set an Cookie Tip -  setC("value", "any");
function setC(name, value, options = {}) {

    options = {
      path: '/',
      ...options
    };
  
    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }
  
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  
    for (let optionKey in options) {
      updatedCookie += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
      }
    }
  
    document.cookie = updatedCookie;
}

// Delete a Cookie Tip - delC("value");
function delC(name) {
    setC(name, "", {
      'max-age': -1
    })
}

// Кодирование: Строка (с кириллицей) -> Base64
function encodeB(str) {
  const bytes = new TextEncoder().encode(str);
  const binString = String.fromCodePoint(...bytes);
  return btoa(binString);
}

// Декодирование: Base64 -> Строка (с кириллицей)
function decodeB(base64Str) {
  const binString = atob(base64Str);
  const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0));
  return new TextDecoder().decode(bytes);
}

// For My needs =)
function SeparateResult(HashName) {
  let data = decodeB(GetReqData(HashName));
  let res = data.split(",");
  return res;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // Максимум и минимум включаются
}

function imageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        // Успешное завершение чтения
        reader.onload = () => resolve(reader.result);
        
        // Обработка ошибки
        reader.onerror = (error) => reject(error);
        
        // Чтение файла как Data URL
        reader.readAsDataURL(file);
    });
}

// Пример использования:
// const fileInput = document.querySelector('#myFileInput');

// fileInput.addEventListener('change', async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     try {
//         const base64String = await imageToBase64(file);
//         console.log(base64String); // Готовая строка для src у <img>
//     } catch (error) {
//         console.error('Ошибка при конвертации:', error);
//     }
// });