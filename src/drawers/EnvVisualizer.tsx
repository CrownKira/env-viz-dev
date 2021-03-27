import { Context } from 'js-slang';
import React from 'react';

import { Layout } from './Layout';

type SetVis = (vis: React.ReactNode) => void;

export default class EnvVisualizer {
  private static setVis: SetVis;

  static init(setVis: SetVis) {
    this.setVis = setVis;
  }

  static drawEnv(context: Context) {
    Layout.setContext(context);
    this.setVis(Layout.draw());
  }
}
