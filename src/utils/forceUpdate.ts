import { useState } from 'react';

export default function useForceUpdate(): () => void {
  const [, setValue] = useState<number>(0);
  return () => setValue(value => value + 1);
}
