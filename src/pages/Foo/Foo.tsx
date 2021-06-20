import React from 'react';
import { Button } from 'starfall';
import { useAsyncFn } from 'react-use';
import { apiGetFirstPost } from '@/apis/auth';
import DashboardLayout from '@/layouts/DashboardLayout';
import type { Page } from '../Page.d';
import { RouteView } from '@/router/RouteView';

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const Foo: Page<{
  post?: Post;
}> = ({ post }) => {
  const [{ value: firstPost, loading: firstPostLoading }, getFirstPost] = useAsyncFn(
    () => apiGetFirstPost({ id: 1 }),
    []
  );

  return (
    <DashboardLayout>
      <Button loading={firstPostLoading} onClick={getFirstPost}>
        sadad
      </Button>
      {!firstPostLoading ? <pre>{'' + firstPostLoading + JSON.stringify(post || firstPost, null, 4)}</pre> : null}
      <RouteView />
    </DashboardLayout>
  );
};

Foo.getInitialProps = async () => {
  const post = await apiGetFirstPost({ id: 1 });
  return { post };
};

export const Abc: React.FC = () => {
  return (
    <div>
      <div></div>
    </div>
  );
};

export default Foo;
