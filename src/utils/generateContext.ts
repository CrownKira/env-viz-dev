import { runInContext } from 'js-slang/dist/';
import createContext from 'js-slang/dist/createContext';
import { Context } from 'js-slang/dist/types';

import { chapter } from '../configs';

const generateContext = async (code: string): Promise<Context> => {
  const context = createContext(chapter);
  await runInContext(code, context);
  return context;
};

export default generateContext;
