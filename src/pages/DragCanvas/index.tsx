import React, { useState } from 'react';
import { DataItemProps } from '@/utils/Data.d';
import {
  ReactSortable,
  ReactSortableProps,
  ItemInterface,
} from 'react-sortablejs';

export interface DragCanvasProps {
  data: Array<DataItemProps>; // 数据
  path: string; // 数据路径 保存位置为路径下的 children[] 字段;
  onSave: (child: Array<DataItemProps>, path: string) => void; // 保存数据
}
const DragCanvas: React.FC<DragCanvasProps> = (props) => {
  const { data } = props;

  const [dataList, setDataList] = useState(data || []);

  const loop = (data) => {
    return <div></div>;
  };

  return (
    <div>
      <ReactSortable list={dataList as never} setList={() => {}}>
        {loop(dataList)}
      </ReactSortable>
    </div>
  );
};

export default DragCanvas;
