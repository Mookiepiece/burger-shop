import React, { useImperativeHandle, useState } from 'react';
import { Spin } from 'starfall';
import useRequest from '@/hooks/useRequest';
import { apiGetCommentKeywords } from '@/apis/auth';
import { useMount } from 'react-use';

const _QuoteBuilderSiderComment: React.ForwardRefRenderFunction<
  {
    value: string;
  },
  {
    initialState?: string[];
  }
> = ({ initialState }, ref) => {
  const [{ value: commentKeywords, loading: commentKeywordsLoading }, triggerGetCommentKeywords] = useRequest(
    apiGetCommentKeywords,
    { initialState: initialState !== undefined ? { value: initialState, loading: false } : undefined }
  );

  useMount(() => {
    if (!commentKeywords) triggerGetCommentKeywords();
  });

  const [value, setValue] = useState('');

  useImperativeHandle(
    ref,
    () => ({
      get value() {
        return value;
      },
    }),
    [value]
  );

  return (
    <div style={{ margin: '20px 0' }}>
      填写备注：
      <textarea style={{ width: '100%' }} value={value} onChange={e => setValue(e.target.value)}></textarea>
      热门词汇
      <button onClick={triggerGetCommentKeywords}>换一批</button>
      <Spin.Container loading={commentKeywordsLoading}>
        {commentKeywords?.map(s => (
          <div
            key={s}
            style={{ display: 'inline-block', padding: '6px 20px', margin: 4, fontSize: 12, background: '#f2f2f2' }}
            onClick={() => setValue(z => z + s)}
          >
            {s}
          </div>
        ))}
      </Spin.Container>
    </div>
  );
};

const QuoteBuilderSiderComment = React.memo(React.forwardRef(_QuoteBuilderSiderComment));

export default QuoteBuilderSiderComment;
