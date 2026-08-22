// Lazy Lib LITE By Wertywin2353
// v1.0.1B For JS
// Non-commercial use! Only for personal usage. Ясно?
// Created in 2024, Ye.


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

// Decode Base64 String
function decodeB(string) {
    let value = window.atob(string);
    return value;
}

// Encode Base64 String
function encodeB(string) {
    let value = window.btoa(string);
    return value;
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