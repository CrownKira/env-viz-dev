import { Binding } from './components/binding/Binding';
import { ArrayUnit } from './components/binding/value/ArrayUnit';
import { ValueTypes, FnTypes, Env, EmptyObject } from './types';
import { Value } from './components/binding/Value';
import { ArrayValue } from './components/binding/value/ArrayValue';
import { FnValue } from './components/binding/value/FnValue';
import { PairValue } from './components/binding/value/PairValue';
import { PrimitiveValue } from './components/binding/value/PrimitiveValue';
import { GlobalFnValue } from './components/binding/value/GlobalFnValue';

/** checks if `value` is an object */
export function isObject(value: any): value is object {
  return value === Object(value);
}

/** checks if `object` is empty */
export function isEmptyObject(object: Object): object is EmptyObject {
  return Object.keys(object).length === 0;
}

/** checks if `env` is empty (head of env is empty object) */
export function isEmptyEnvironment(env: Env): env is Env & { head: EmptyObject } {
  return isEmptyObject(env.head);
}

/** checks if `value` is a Javascript array */
export function isArray(value: ValueTypes): value is ValueTypes[] {
  // or typeof value === "object" && value !== null
  return Array.isArray(value);
}

/** checks if `value` is a `PairValue`, defined as any array of length 2 */
export function isPairValue(value: ValueTypes): value is [ValueTypes, ValueTypes] {
  return isArray(value) && (value as ValueTypes[]).length === 2;
}

/** checks if `value` is a `ArrayValue`, defined as any array of length not 2 */
export function isArrayValue(value: ValueTypes): value is ValueTypes[] {
  return isArray(value) && !isPairValue(value);
}

/** checks if `value` is a Javascript function */
function isFunction(value: any): value is () => any {
  return !!value && {}.toString.call(value) === '[object Function]';
}

/** checks if `value` is a JS Slang function */
export function isFn(value: ValueTypes): value is FnTypes {
  return isFunction(value) && 'environment' in value && 'functionName' in value;
}

/** checks if `value` is null */
export function isNull(value: ValueTypes): value is null {
  return value === null;
}

/** checks if `value` is a string */
export function isString(value: ValueTypes): value is string {
  return typeof value === 'string';
}

/** create an instance of the corresponding `Value` */
export function createValue(data: ValueTypes, referencedBy: Binding | ArrayUnit): Value {
  if (isPairValue(data)) {
    return new PairValue(data, referencedBy);
  } else if (isArrayValue(data)) {
    return new ArrayValue(data, referencedBy);
  } else if (isFunction(data)) {
    if (isFn(data)) {
      // normal JS Slang function
      return new FnValue(data, referencedBy);
    } else {
      // function from the global env (has no extra props such as env, fnName)
      return new GlobalFnValue(data, referencedBy);
    }
  } else {
    return new PrimitiveValue(data, referencedBy);
  }
}
