import { Quote } from '@/types/Quote';
import { intranetClient } from '../utils/request';

type Req = {
  id: number;
};
type Res = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export const apiGetFirstPost = ({ id }: Req): Promise<Res> => {
  console.log('original 14');
  return intranetClient.get<Req, Res>(`/posts/${id}`, { id });
};

export const apiMockingBird = <T>(v: T): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(v), 1000);
  });
};

export const apiQuote = async (quote: Quote): Promise<Quote> => {
  const price: number = await new Promise(resolve => {
    setTimeout(
      () =>
        resolve(
          quote.wiches.reduce((sum, w) => {
            if (w.type === 'lettuce') {
              return sum + 1;
            } else {
              return sum + 2;
            }
          }, 0)
        ),
      1000
    );
  });

  return { ...quote, price };
};

export const apiGetCommentKeywords = async (): Promise<string[]> => {
  // Agthu https://www.zhihu.com/question/452077814/answer/1809599373

  const n1 = '少放葱、多放葱、不放葱'.split('、');

  const n2 = '不放辣子、少放辣子、多放辣子'.split('、');

  const n3 = '多放辣子、少放辣子、不放辣子'.split('、');

  const n4 = '多放葱、少放葱、不放葱'.split('、');

  return apiMockingBird([n1, n2, n3, n4][Math.floor(Math.random() * [n1, n2, n3, n4].length)]);
};
