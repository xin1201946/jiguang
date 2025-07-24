/**
 * 将 JSON 对象转换为字符串。
 */
function stringifyJson(json){
  try {
    return JSON.stringify(json);
  } catch (error) {
    return null;
  }
}

/**
 * 将字符串转换为 JSON 对象。
 */
function parseJson(jsonString){
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

/**
 * 设置本地存储或会话存储的值。
 */
export function setSettings(
  name,
  value,
  isJson = false,
  isSession = false
){
  try {
    if (typeof window === 'undefined') {
      return false;
    }

    if (isJson) {
      value = stringifyJson(value);
    }

    if (typeof value !== 'string') {
      value = String(value); // 强制转成字符串防止类型异常
    }

    if (isSession) {
      sessionStorage.setItem(name, value);
    } else {
      localStorage.setItem(name, value);
    }

    return true;
  } catch (error) {
    console.error('Failed to set settings:', error);
    return false;
  }
}

/**
 * 获取本地存储或会话存储的值。
 */
export function getSettings(name, isJson = false){
  try {
    if (typeof window === 'undefined') {
      return null;
    }

    let value = sessionStorage.getItem(name) || localStorage.getItem(name);
    if (value === null) return null;

    if (isJson) {
      value = parseJson(value);
    }

    return value ?? null;
  } catch (error) {
    console.error('Failed to get settings:', error);
    return null;
  }
}

/**
 * 获取所有本地存储的数据。
 */
export function getAllLocalStorage() {
  if (typeof window === 'undefined') {
    return "No local storage data found";
  }

  if (localStorage.length === 0) return "No local storage data found";
  let result = "";
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key !== null) {
      const value = localStorage.getItem(key);
      result += `${key}: ${value}\n`;
    }
  }
  return result.trim();
}

/**
 * 清空本地存储。
 */
export function clearLocalStorage() {
  if (typeof window === 'undefined') {
    return 'Not available on server side';
  }

  localStorage.clear();
  return 'Done';
}