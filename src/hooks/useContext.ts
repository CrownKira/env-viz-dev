import { Context } from 'js-slang/dist/types';
import { useState, useEffect } from 'react';
import { Libraries } from '../libraries';
import generateContext from '../utils/generateContext';

const useContext = (code: string, selectedLib: Libraries) => {
  const [context, setContext] = useState<Context | undefined>();

  useEffect(() => {
    (async () => {
      setContext(await generateContext(code));
    })();
  }, [code, selectedLib]);

  return [context];
};

export default useContext;
