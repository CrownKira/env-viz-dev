import { Frame } from './components/Frame';
import { Environment } from 'js-slang/dist/types';

/** classes with a drawing logic */
export interface Drawable {
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
export type PrimitiveTypes = number | string | null;

/** types of functions in JS Slang */
export interface FnTypes {
  /** the function itself */
  (): any;

  /** the enclosing environment */
  environment: Environment;

  /** string representation of the function */
  functionName: string;
}

/** the types that `Value` can take  */
export type ValueTypes = PrimitiveTypes | FnTypes | (() => any) | ValueTypes[];

/** modified Environment type to store children and associated frame */
export type Env = Environment & { childEnvs?: Env[]; frame?: Frame };

/** empty object type  */
export type EmptyObject = {
  [K in any]: never;
};
