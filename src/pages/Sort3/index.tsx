import React, { Children, useState } from 'react';
import {
  DragDropContext,
  DropResult,
  ResponderProvided,
} from 'react-beautiful-dnd';
import { onEnd } from './utils';
import { ItemWarp, Item } from './ItemWarp';
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

  return (
    <DragDropContext
      onDragEnd={(result: DropResult, provided: ResponderProvided) => {
        console.log(result, provided);
      }}
    >
      <ItemWarp droppableId="0">
        <Item draggableId="0-0" index={0}>
          测试
        </Item>
        <Item draggableId="0-1" index={1}>
          测试1
        </Item>
        <Item draggableId="0-2" index={2}>
          测试2
        </Item>
      </ItemWarp>
      <ItemWarp droppableId="1">
        <Item draggableId="1-0" index={0}>
          测试1
        </Item>
        <Item draggableId="1-1" index={1}>
          测试2
        </Item>
        <Item draggableId="1-2" index={2}>
          测试3
        </Item>
        <Item draggableId="1-3" index={3}>
          <ItemWarp
            droppableId="1-3-0"
            style={{ background: 'red', display: 'flex' }}
          >
            <Item draggableId="1-3-0-0" index={0}>
              测试1-3-0-0
            </Item>
            <Item draggableId="1-3-0-1" index={1}>
              测试1-3-0-1
            </Item>
            <Item draggableId="1-3-0-2" index={2}>
              测试1-3-0-2
            </Item>
          </ItemWarp>
        </Item>
      </ItemWarp>
    </DragDropContext>
  );
};
