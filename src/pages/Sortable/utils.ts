import Sortable from 'sortablejs';
import lodash, { cloneDeep } from 'lodash';
import update from 'immutability-helper';

const getPath = (path: string): number[] =>
  path.split('-').map((k) => Number(k));

// 根据路径获取数据
const findCloneData = (path: string, data: any[]) => {
  let findData = data;
  const arrPath: number[] = getPath(path);
  let lg = arrPath.length;
  let i = 0;
  while (i < lg) {
    const index: number = arrPath[i];
    if (findData[index]) {
      findData = findData[index];
    }
    i++;
  }
  return findData;
};
// 根据路径获取数据
const findRemoveData = (path: string, data: any[]) => {
  const arr = getPath(path);
  let result: any = {};
  arr.forEach((n) => {
    result = data[n];
    data = result.children;
  });
  return result;
};

// 获取新老位置
const getNewAndOld = (evt: Sortable.SortableEvent) => {
  const oldIndex = evt.oldIndex;
  const newIndex = evt.newIndex;
  const pullMode = evt.pullMode;
  const fromDataId = evt.clone.getAttribute('data-id');
  const toDataId = evt.to.getAttribute('data-id');
  // 判断 pullMode 值 可以判断出 是在一个里面还是不在一个里面
  return {
    oldIndex,
    newIndex,
    pullMode,
    fromDataId,
    toDataId,
  };
};

// 根据路径 删除数据
const removeItem = (path: string, oldIndex: number, data: any[]) => {
  let pathArr = getPath(path);
  pathArr.pop();
  let parentData: any = findRemoveData(pathArr.join('-'), data);
  parentData.children.splice(oldIndex, 1);
  return cloneDeep(data);
};
// 根据路径添加
const insertItem = (
  path: string,
  data: any[],
  toIndex: number,
  addItem: any,
) => {
  let parent: any = findRemoveData(path, data);
  if (parent.children) {
    parent.children.splice(toIndex, 0, addItem);
    return cloneDeep(data);
  }
  parent.splice(toIndex, 0, addItem);
  return cloneDeep(data);
};
// 当前位置
export const getCurrentItemIndex = (oldIndex: string, newIndex: string) => {
  const oldArr = getPath(oldIndex);
  const newArr = getPath(newIndex);
  const oldLg = oldArr.length - 1;
  const oldLastNum = oldArr[oldLg];
  const newNum = newArr[oldLg];
  if (Number(newNum) > Number(oldLastNum)) {
    newArr[oldLg] = newArr[oldLg] - 1;
    return newArr.join('-');
  }
  return newIndex;
};

// 新增
export const onAdd = (
  evt: Sortable.SortableEvent,
  data: any[],
  onChoose: (...arg: any) => void,
) => {
  const { oldIndex, newIndex, pullMode, fromDataId, toDataId } =
    getNewAndOld(evt);
  const dataList = cloneDeep(data);

  if (typeof oldIndex !== 'number' || typeof newIndex !== 'number') {
    return dataList;
  }
  if (!fromDataId || !toDataId) {
    return dataList;
  }
  // 1. 如果是 克隆 则进行 获取配置数据进行添加
  if (pullMode === 'clone' && fromDataId && toDataId) {
    const arr = getPath(toDataId);
    if (arr.length === 0) {
      return dataList;
    }
    const itemData = findCloneData(fromDataId, []);
    if (toDataId === '0') {
      if (newIndex === 0) {
        data.unshift(itemData);
      } else {
        data.splice(newIndex, 0, itemData);
      }
      console.log(data);
      return data;
    }

    let result: any = {};
    arr.forEach((index) => {
      result = dataList[index];
    });
    result.children = itemData;
    onChoose(itemData, `${toDataId}-${newIndex}`);
    return cloneDeep(dataList);
  }
  // 2. 如果是 一个列表移入另一个列表中 这 移出数据位置 删除并获取删除的这条数据   在移入位置放进去
  // 2.1 先删除 移出的数据并保存删除项
  // 2.2 找出移入位置 保存数据
  const formDataIdArr = getPath(fromDataId);
  const toDataIdArr = getPath(toDataId);
  // 比较路径的上下位置 先执行靠下的数据 再执行考上数据
  if (formDataIdArr > toDataIdArr) {
    const addItem = findRemoveData(fromDataId, dataList);
    const remoteData = removeItem(fromDataId, oldIndex, dataList);
    const insertData = insertItem(toDataId, remoteData, newIndex, addItem);
    onChoose(addItem, `${toDataId}-${newIndex}`);
    return insertData;
  }
  const addItem = findRemoveData(fromDataId, dataList);
  const insertData = insertItem(toDataId, dataList, newIndex, addItem);
  const remoteData = removeItem(fromDataId, oldIndex, insertData);
  const currentIndex = getCurrentItemIndex(fromDataId, toDataId);
  onChoose(addItem, currentIndex);
  return cloneDeep(remoteData);
};

// 更新位置
export const onUpdate = (
  evt: Sortable.SortableEvent,
  data: any[],
  onChoose: (...arg: any) => void,
) => {
  const { oldIndex, newIndex, pullMode, fromDataId, toDataId } =
    getNewAndOld(evt);
  const dataList = cloneDeep(data);
  if (typeof oldIndex !== 'number' || typeof newIndex !== 'number') {
    return dataList;
  }

  // 内部排序使用
  let pathArr = getPath(fromDataId || '');
  pathArr.pop();
  let parentData: any = findRemoveData(pathArr.join('-'), data);
  let dragItem: any = findRemoveData(fromDataId || '', data);
  parent = update(parentData.children, {
    $splice: [
      [oldIndex, 1],
      [newIndex, 0, dragItem],
    ],
  });
  parentData.children = parent;
  const resultData = lodash.update(
    dataList,
    pathArr.join('.children.'),
    () => parentData,
  );
  console.log(pathArr.join('.children.'));
  return cloneDeep(resultData);
};
