import { useReducer } from 'react';

const useForceUpdate = () => {
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void; // <- paste here
  return [forceUpdate];
};

export default useForceUpdate;
