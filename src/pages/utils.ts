import Sortable from 'sortablejs';
import lodash, { cloneDeep } from 'lodash';
import update from 'immutability-helper';
/**
 * @description:
 * @param {string} path 路径
 * @return {Array<number>}
 */
const getPathArr = (path: string): number[] =>
  (path || '').split('-').map((k: string) => Number(k));

const getUpdatePath = (path: string): string =>
  (path || '').split('-').join('.children.');

const getPathData = (path: string, data: any[], isChild?: boolean) => {
  let result: any;
  const arr = getPathArr(path);
  arr.forEach((k, index) => {
    if (index === 0) {
      result = data[k];
    } else {
      if (result.children) {
        result = result.children[k];
      }
    }
  });
  if (isChild && result.children) {
    result = result.children;
  }
  return result;
};
export const clearEmtyData = (dataList: any[]) => {
  let childList = dataList.filter((item) => item);
  childList.forEach((item) => {
    if (item.children && Array.isArray(item.children) && item.children.length) {
      item.children = clearEmtyData(item.children);
    }
  });
  return childList;
};

// 获取新老位置
const getNewAndOld = (evt: Sortable.SortableEvent) => {
  const oldIndex = evt.oldIndex as number;
  const newIndex = evt.newIndex as number;
  const pullMode = evt.pullMode;
  const oldPath = evt.clone.getAttribute('data-id') || '';
  let oldParentPath = oldPath.split('-');
  oldParentPath.pop();
  const toDataId = evt.to.getAttribute('data-id');
  // 判断 pullMode 值 可以判断出 是在一个里面还是不在一个里面
  return {
    // 老的数组下标
    oldIndex,
    // 新的数组下标
    newIndex,
    // 如果 pullMode 为 null 则 当前层级排序
    pullMode,
    // 如果 oldParentPath 为空 则 为最外层数据
    oldParentPath: oldParentPath.join('-'),
    // 老的 数组下标 路径
    oldPath: oldPath,
    // 最新放入的父级数组下标路径
    newParentPath: toDataId || '',
    // 最新的放置下标路径
    newPath: `${toDataId}-${newIndex}`,
  };
};
export const onEnd = (
  evt: Sortable.SortableEvent,
  dataList: any[],
  onChoose: (currentPath: string, item: any) => void,
) => {
  const OptData = cloneDeep(dataList);
  const {
    oldIndex,
    newIndex,
    pullMode,
    oldParentPath,
    oldPath,
    newParentPath,
    newPath,
  } = getNewAndOld(evt);
  const item = {
    element: evt.item,
    clone: evt.clone,
    parentElement: evt.from,
  };
  // 需要对dom节点进行操作
  // 1. 当前内部进行 排序
  if (!pullMode) {
    /* eslint-disable */
    if (item.parentElement !== null) {
      item.parentElement.removeChild(evt.item);
    }
    if (item.parentElement) {
      const refChild = item.parentElement.childNodes[oldIndex] || null;
      if (refChild) {
        item.parentElement.insertBefore(evt.item, refChild);
      } else {
        item.parentElement.appendChild(evt.item);
      }
    }
  } else if (pullMode === 'clone') {
    // 克隆添加的 移除当前所在的位置
    if (item.element && item.element.parentElement) {
      item.element.parentElement.removeChild(item.element);
    }
  } else {
    // 不是内部排序 不是 克隆 添加
    if (item.element && item.element.parentElement) {
      item.element.parentElement.removeChild(item.element);
    }
    if (item.parentElement) {
      const refChild = item.parentElement.childNodes[oldIndex] || null;
      if (refChild) {
        item.parentElement.insertBefore(evt.item, refChild);
      } else {
        item.parentElement.appendChild(evt.item);
      }
    }
  }
  if (
    typeof oldIndex !== 'number' ||
    typeof newIndex !== 'number' ||
    oldPath === newPath
  ) {
    return OptData;
  }

  // 还有一种 克隆 的节点 不存在当前位置 在其他位置

  // 当前内部排序
  if (!pullMode) {
    const parentChildData = getPathData(oldParentPath, OptData, true);
    const oldItem = getPathData(oldPath, OptData);
    const parentChild = update(parentChildData, {
      $splice: [
        [oldIndex, 1],
        [newIndex, 0, oldItem],
      ],
    });
    const updateParentPath = getUpdatePath(oldParentPath);
    const resultData = lodash.update(
      OptData,
      `${updateParentPath}.children`,
      () => parentChild,
    );
    onChoose(oldItem, newPath);
    return cloneDeep(resultData);
  } else if (pullMode === 'clone') {
    // 克隆的数据
    const newAddItem: any = { title: '新增的数据' };
    const parentChildData = getPathData(newParentPath, OptData, true);
    parentChildData.splice(newIndex, 0, newAddItem);
    const resultData = lodash.update(
      OptData,
      `${newParentPath}.children`,
      () => parentChildData,
    );
    onChoose(newAddItem, newPath);
    return cloneDeep(resultData);
  }
  // 1. 先取老的值
  // 2. 把老的位置的值为空 用于站位
  // 3. 把老的值 放在新的位置上
  // 4. 把刚才置空的位置过滤掉

  // 1. 先取老的值
  const oldItem = getPathData(oldPath, OptData);
  // 2把老的位置的值为空 用于站位
  const updateParentPath = getUpdatePath(oldPath);
  const emtyData = lodash.update(
    OptData,
    `${updateParentPath}`,
    () => undefined,
  );
  if (
    (newParentPath === '' || !newParentPath) &&
    oldParentPath !== '' &&
    oldParentPath
  ) {
    // 最新的位置为 最外层 老的位置为内层
    emtyData.splice(newIndex, 0, oldItem);
    onChoose(oldItem, newIndex);
    return cloneDeep(clearEmtyData(emtyData));
  } else if (
    (oldParentPath === '' || !oldParentPath) &&
    (newParentPath === '' || !newParentPath)
  ) {
    // 新的老的都是最外层
    const resultData = update(emtyData, {
      $splice: [
        [oldIndex, 1],
        [newIndex, 0, oldItem],
      ],
    });
    onChoose(oldItem, newPath);
    return cloneDeep(clearEmtyData(resultData));
  }
  const parentChildData = getPathData(newParentPath, emtyData, true);
  parentChildData.splice(newIndex, 0, oldItem);
  const resultData = lodash.update(
    emtyData,
    `${newParentPath}.children`,
    () => parentChildData,
  );
  onChoose(oldItem, newPath);
  return cloneDeep(clearEmtyData(resultData));
};
