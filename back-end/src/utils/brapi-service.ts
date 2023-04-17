import { BrapiAvaiable } from '../protocols';
import { request } from './request';

async function getTickers(ticker: string): Promise<BrapiAvaiable> {
  const result = await request.get(`https://brapi.dev/api/available?search=${ticker}`);

  return result.data;
}

export { getTickers };
