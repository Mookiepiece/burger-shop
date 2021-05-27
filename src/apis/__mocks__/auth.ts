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
  console.log('mocked 12');
  return Promise.resolve({
    userId: 100,
    id: 100,
    title: 'ii',
    body: '12121',
  });
};
