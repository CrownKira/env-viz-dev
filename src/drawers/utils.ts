// Fix later
export function isEmptyArray(xs: any): any {
  return isDataValue(xs) && xs.length === 0;
}

export function isEmptyObject(object: any): any {
  return Object.keys(object).length === 0;
}

export function isDataValue(value: any): any {
  // or typeof value === "object" && value !== null
  return Array.isArray(value);
}

export function isFnValue(value: any): any {
  // or typeof value === "function"
  return value && {}.toString.call(value) === '[object Function]';
}

// check if dataObject is an array
// however does not work with arrays of size 2
export function isArrayData(dataObject: any): any {
  return isDataValue(dataObject) ? dataObject.length !== 2 : false;
}

export function isNull(x: any): any {
  return x === null;
}

export function isUndefined(x: any): any {
  return typeof x === 'undefined';
}

export function isString(x: any): any {
  return typeof x === 'string';
}

export function isPairData(dataObject: any): any {
  return isDataValue(dataObject) && dataObject.length === 2;
}

// extract all the tail envs from the given environment
export function extractEnvs(environment: any): any {
  if (isNull(environment)) {
    return [];
  } else {
    // prepend the extracted tail envs, so that the outermost environment comes last
    return [...extractEnvs(environment.tail), environment];
  }
}
