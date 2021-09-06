import React, { useRef } from 'react';
import Sortable from 'sortablejs';
export interface SortableProps {
  sortProps?: Sortable.Options;
  children?: React.ReactNode;
  nodeTag?: string;
  warpProps?: any;
}
export default (props: SortableProps) => {
  const { sortProps, children, nodeTag = 'div', warpProps = {} } = props;
  const sortTableRef = useRef<Sortable>();

  const newSortable = (node: any) => {
    if (!node) {
      sortTableRef.current && sortTableRef.current.destroy();
      return;
    }
    sortTableRef.current = Sortable.create(node, {
      ...(sortProps || {}),
    });
  };
  return React.createElement(
    nodeTag,
    { ...(warpProps || {}), ref: newSortable },
    React.Children.map(children as React.ReactElement<any>[], (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          'data-id': child.key,
        } as any);
      }
    }),
  );
};
