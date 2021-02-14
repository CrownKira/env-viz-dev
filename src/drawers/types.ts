import { Binding } from './components/binding/Binding';
import { ArrayUnit } from './components/binding/value/ArrayUnit';
import { Frame } from './components/Frame';
import { Environment } from 'js-slang/dist/types';

/** classes with a drawing logic */
export interface Drawable {
  /// any class that has draw method
  /** the draw logic */
  draw: () => React.ReactNode;
}

/** classes that will be visible on the canvas */
export interface Visible extends Drawable {
  /** x coordinate of top-left corner */
  x: number;

  /** y coordinate of top-left corner */
  y: number;

  /** width */
  width: number;

  /** height */
  height: number;
}

/** types of primitives in JS Slang  */
export type PrimitiveTypes = number | string | null; /// any number, string, null from js slang

/** types of functions in JS Slang */
export interface FnTypes {
  /** the function itself */
  (): any;

  /** the enclosing environment */
  environment: Environment;

  /** string representation of the function */
  functionName: string;
} /// data refers to primitive data

/** the types of data in the JS Slang context */
/// primitive !!
export type Data = PrimitiveTypes | FnTypes | (() => any) | Data[]; /// array of data ie. array, pair, etc

/** modified Environment type to store children and associated frame */
export type Env = Environment & { childEnvs?: Env[]; frame?: Frame }; /// additional child env and frame prop

/** empty object type  */
export type EmptyObject = {
  [K in any]: never;
};

/** types that a reference can be: either from a binding in a frame or from an array  */
export type ReferenceTypes = Binding | ArrayUnit; /// binding or array unit
