import LZString from 'lz-string';

import ISSUES from './issues';
import SAMPLES from './samples';

export interface Sample {
  id?: number;
  name?: string;
  link?: string;
  description?: string;
  code: string;
}

function loadSamples(samples: Sample[], namePrefix: string): Sample[] {
  return samples.map(({ code, description }: Sample, id: number) => {
    const name = namePrefix + ` ${id}`;
    const lzString = LZString.compressToEncodedURIComponent(code);
    const link = `https://sourceacademy.nus.edu.sg/playground#chap=4&exec=1000&ext=NONE&prgrm=${lzString}&variant=default`;

    return {
      id,
      name,
      link,
      code,
      description: description || name
    };
  });
}

export const samples = loadSamples(SAMPLES, 'Sample');
export const issueSamples = loadSamples(ISSUES, 'Issue Sample');
