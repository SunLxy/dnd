import React, { useEffect, useRef, useState } from 'react';
import ReactDom from 'react-dom';
import Sortable from 'sortablejs';
import { ReactSortable, ReactSortableProps } from '../ReactSort1';
import { Row, Col } from 'antd';
import { cloneDeep, update } from 'lodash';
import './styles.css';
import { onUpdate, onAdd } from './utils';
import {} from 'react-sortablejs';
const dataList = [
  {
    title: '测试1',
    children: [
      { title: 'Item 1.1' },
      { title: 'Item 1.2' },
      { title: 'Item 1.3' },
      { title: 'Item 1.4' },
      { title: 'Item 1.5' },
    ],
  },
  {
    title: '测试2',
    children: [
      { title: 'Item 2.1' },
      { title: 'Item 2.2' },
      { title: 'Item 2.3' },
      { title: 'Item 2.4' },
      { title: 'Item 2.5' },
    ],
  },
  {
    title: '测试3',
    children: [
      { title: 'Item 3.1' },
      { title: 'Item 3.2' },
      { title: 'Item 3.3' },
      { title: 'Item 3.4' },
      { title: 'Item 3.5' },
    ],
  },
];

const sortableOption: Omit<ReactSortableProps<any>, 'list' | 'setList'> = {
  animation: 150,
  fallbackOnBody: true,
  // swapThreshold: 0.65,
  invertSwap: true,
  direction: 'horizontal',
  // handle:".handle",
  group: {
    name: 'groupName',
    pull: true,
    put: true,
  },
};

function App() {
  const [data, setData] = useState<any[]>(cloneDeep(dataList));

  // 选中项
  const onChoose = (item: any) => {
    // e && e.stopPropagation();
  };

  const sortableUpdate = (evt: Sortable.SortableEvent) => {
    const updateData = onUpdate(evt, data, onChoose);
    console.log(JSON.stringify(updateData));
    setData(updateData);
  };

  const sortableAdd = (evt: Sortable.SortableEvent) => {
    const addData = onAdd(evt, data, onChoose);
    console.log(JSON.stringify(addData));
    setData(addData);
  };

  return (
    <div>
      <ReactSortable
        {...sortableOption}
        list={data}
        // onUpdate={sortableUpdate}
        // onAdd={sortableAdd}
        onChoose={onChoose}
        tag={Row}
        // setList={() => { }}
        className="list"
        style={{ border: '1px solid red', margin: 10 }}
      >
        {data.map((item, parentIndex) => {
          return (
            <div key={`${parentIndex}`} data-id={`${parentIndex}`}>
              <ReactSortable
                key={`${parentIndex}`}
                data-id={`${parentIndex}`}
                {...sortableOption}
                list={item.children}
                onUpdate={sortableUpdate}
                onAdd={sortableAdd}
                onChoose={onChoose}
                // setList={() => { }}
                className="list"
                style={{ border: '1px solid #000' }}
              >
                {item.children.map((itm, childIndex) => {
                  return (
                    <div key={`${parentIndex}-${childIndex}`}>
                      <div
                        key={`${parentIndex}-${childIndex}`}
                        data-id={`${parentIndex}-${childIndex}`}
                      >
                        {itm.title}
                      </div>
                    </div>
                  );
                })}
              </ReactSortable>
            </div>
          );
        })}
      </ReactSortable>
    </div>
  );
}
export default App;
