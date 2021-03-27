import createContext from 'js-slang/dist/createContext';
import { runInContext } from 'js-slang/dist/';
import { chapter } from '../configs';
import { Context } from 'js-slang/dist/types';

const generateContext = async (code: string): Promise<Context> => {
  const context = createContext(chapter);
  await runInContext(code, context);
  return context;
};

export default generateContext;
