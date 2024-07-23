import { cookies } from 'next/headers';

import axios from '../axios';

export async function getMe(_request: GetMeRequest): Promise<GetMeResponse | undefined> {
  const session = cookies().get('session');
  if (!session) {
    console.warn(' GET /me [WARN] no session found:', session);
    return;
  }

  const startTime = Date.now();

  try {
    const { data } = await axios.get('/me');
    return data;
  } catch (error: any) {
    const endTime = Date.now();
    const ms = endTime - startTime;
    const status = error.response.status;

    console.error(' GET /me', status, `in ${ms}ms`);
    return;
  }
}
