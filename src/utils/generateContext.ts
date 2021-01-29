import createContext from 'js-slang/dist/createContext';
import { runInContext } from 'js-slang/dist/';
import { chapter } from '../configs';

const generateContext = async (code: any): Promise<Object> => {
  const context = createContext(chapter);
  await runInContext(code, context);
  return context;
};

export default generateContext;
