import React, { useRef, useImperativeHandle } from 'react';
import Sortable from 'sortablejs';
export interface ItemProps {
  sortProps?: Sortable.Options;
  children?: React.ReactNode;
  nodeTag?: string;
  warpProps?: any;
}
export default React.forwardRef((props: ItemProps, ref) => {
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
  useImperativeHandle(ref, () => sortTableRef.current);
  console.log(children);
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
});
