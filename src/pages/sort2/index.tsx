import React, { useState } from 'react';
import ItemWarp from './ItemWarp';
import Sortable from 'sortablejs';
import { onEnd } from './utils';

export default () => {
  const [dataList, setDataList] = useState([
    {
      title: ' 测试1',
      children: [
        { title: 'item 1.1' },
        { title: 'item 1.2' },
        { title: 'item 1.3' },
        { title: 'item 1.4' },
        { title: 'item 1.5' },
        { title: 'item 1.6' },
      ],
    },
    {
      title: ' 测试2',
      children: [
        { title: 'item 2.1' },
        { title: 'item 2.2' },
        { title: 'item 2.3' },
        { title: 'item 2.4' },
        { title: 'item 2.5' },
        { title: 'item 2.6' },
      ],
    },
    {
      title: ' 测试3',
      children: [
        { title: 'item 3.1' },
        { title: 'item 3.2' },
        { title: 'item 3.3' },
        { title: 'item 3.4' },
        { title: 'item 3.5' },
        { title: 'item 3.6' },
      ],
    },
  ]);

  const sortProps: Sortable.Options = {
    group: 'nodes',
    animation: 300,
    fallbackOnBody: true,
    onEnd: (evt: Sortable.SortableEvent) => {
      // console.log(evt)
      const result = onEnd(evt, dataList, () => {});
      setDataList(result);
      // console.log("ces", result)
    },
  };

  const loop = (data: any[], parentId?: string) => {
    return (data || []).map((item, index: number) => {
      const dataId = parentId ? `${parentId}-${index}` : `${index}`;
      if (item.children) {
        return (
          <ItemWarp
            sortProps={sortProps}
            nodeTag="ul"
            key={dataId}
            warpProps={{ 'data-id': dataId }}
          >
            {loop(item.children, `${dataId}`)}
          </ItemWarp>
        );
      }
      return <li key={dataId}>{item.title}</li>;
    });
  };

  return (
    <div>
      <ItemWarp sortProps={sortProps}>{loop(dataList)}</ItemWarp>
    </div>
  );
};
