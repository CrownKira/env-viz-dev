import { Data, FnTypes, Env, EmptyObject, PrimitiveTypes } from './types';

/** checks if `x` is an object */
export function isObject(x: any): x is object {
  return x === Object(x);
}

/** checks if `object` is empty */
export function isEmptyObject(object: Object): object is EmptyObject {
  return Object.keys(object).length === 0;
}

/** checks if `env` is empty (that is, head of env is an empty object) */
export function isEmptyEnvironment(env: Env): env is Env & { head: EmptyObject } {
  return isEmptyObject(env.head);
}

/** checks if `data` is a Javascript array */
export function isArray(data: Data): data is Data[] {
  // or typeof data === "object" && data !== null
  return Array.isArray(data);
}

/** checks if `data` belongs to a `PairValue`, defined as any array of length 2 */
export function isPairData(data: Data): data is [Data, Data] {
  return isArray(data) && data.length === 2;
}

/** checks if `data` belongs to a `ArrayValue`, defined as any array of length not 2 */
export function isArrayData(data: Data): data is Data[] {
  return isArray(data) && !isPairData(data);
}

/** checks if `x` is a Javascript function */
export function isFunction(x: any): x is () => any {
  return !!x && {}.toString.call(x) === '[object Function]';
}

/** checks if `data` is a JS Slang function */
export function isFn(data: Data): data is FnTypes {
  return isFunction(data) && 'environment' in data && 'functionName' in data;
}

/** checks if `data` is null */
export function isNull(data: Data): data is null {
  return data === null;
}

/** checks if `data` is a string */
export function isString(data: Data): data is string {
  return typeof data === 'string';
}

/** checks if `data` is a number */
export function isNumber(data: Data): data is number {
  return typeof data === 'number';
}

/** checks if `data` is a primitive, defined as a null | data | number */
export function isPrimitiveData(data: Data): data is PrimitiveTypes {
  return isNull(data) || isString(data) || isNumber(data);
}
