import React from 'react';
import {
  Droppable,
  Draggable,
  DroppableProps,
  DraggableProps,
} from 'react-beautiful-dnd';

export interface ItemWarpProps {
  droppableId: string;
  style?: React.CSSProperties;
  setStyle?: (isDraggingOver: boolean) => React.CSSProperties;
  warpProps?: Omit<DroppableProps, 'children' | 'droppableId'>;
  className?: string;
  [k: string]: any;
}

/** 外层嵌套 */
export const ItemWarp: React.FC<ItemWarpProps> = (props) => {
  const {
    droppableId,
    children,
    style = {},
    setStyle = () => ({}),
    ...other
  } = props;
  return (
    <Droppable droppableId={droppableId} {...other}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          style={{ ...style, ...setStyle(snapshot.isDraggingOver) }}
          {...other}
        >
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export interface ItemProps {
  draggableId: string;
  index: number;
  style?: React.CSSProperties;
  setStyle?: (isDraggingOver: boolean) => React.CSSProperties;
  warpProps?: Omit<DraggableProps, 'children' | 'draggableId'>;
  className?: string;
  [k: string]: any;
}

export const Item: React.FC<ItemProps> = (props) => {
  const {
    draggableId,
    index,
    children,
    setStyle = () => ({}),
    style,
    warpProps = {},
    ...other
  } = props;
  return (
    <Draggable index={index} draggableId={draggableId} {...(warpProps || {})}>
      {(provided, snapshot) => {
        // return React.cloneElement(children, {
        //   ref: provided.innerRef,
        //   ...provided.draggableProps,
        //   ...provided.dragHandleProps,
        //   style: { ...provided.draggableProps.style, ...(style || {}), ...setStyle(snapshot.isDragging) }
        // })
        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            {...other}
            ref={provided.innerRef}
            style={{
              ...provided.draggableProps.style,
              ...(style || {}),
              ...setStyle(snapshot.isDragging),
            }}
          >
            {children}
          </div>
        );
      }}
    </Draggable>
  );
};
