import SAMPLES from './samples';
import ISSUES from './issues';
import LZString from 'lz-string';

function loadSamples(samples, namePrefix) {
  return samples.map(({ code, description }, id) => {
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
