import { apiGetFirstPost } from '@/apis/auth';
import React from 'react';
import type { Page } from '../Page.d';
import { Button } from 'starfall';
import 'starfall/src/_theme/index.scss';

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const FooPlus: Page<{
  post2?: Post;
}> = ({ post2 }) => {
  return (
    <>
      {post2?.id}
      <Button>aha</Button>
    </>
  );
};

FooPlus.getInitialProps = async () => {
  const post2 = await apiGetFirstPost({ id: 2 });
  return { post2 };
};

export default FooPlus;
