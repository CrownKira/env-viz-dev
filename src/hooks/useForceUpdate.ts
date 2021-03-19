import { useReducer } from 'react';

const useForceUpdate = () => {
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;
  return [forceUpdate];
};

export default useForceUpdate;
