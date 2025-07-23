import KSUID from 'ksuid';

export function generateUID() {
  return KSUID.randomSync().string;
}
