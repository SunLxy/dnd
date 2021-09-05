import _ from 'lodash';
/**
 * @description: 将下标数组转为数组
 * @param {String|Number} pathStr 字符串类型的树路径 例：2-3-4
 * return {Array}  数组类型
 */
export const indexToArray = (pathStr) => `${pathStr}`.split('-').map((n) => +n);

/**
 * @description: 获取 选中的数据
 * @param {String}  index  下标路径
 * @param {Array}  cards  treeData
 * @return {object}  返回详情对象
 */
export const getCloneItem = (index, cards) => {
  const arr = indexToArray(index);
  let result = {};
  arr.forEach((n) => {
    result = cards[n];
    cards = result.children;
  });
  return _.cloneDeep(result);
};
/**
 * @description:根据下标获取父节点
 * @param {String}   index  下标路径
 * @param {Array}    cards  treeData
 * @return {object}  返回详情对象
 */
export const getItem = (pathIndex, cards) => {
  const arr = indexToArray(pathIndex);
  // 嵌套节点删除
  let parent;
  if (arr.length === 0) {
    return cards;
  }
  arr.forEach((item, index) => {
    if (index === 0) {
      parent = cards[item];
    } else {
      parent = parent.children[item];
    }
  });
  if (parent.children) return parent.children;
  return parent;
};
/**
 * @description: 获取父节点
 * @param {*} pathIndex
 * @param {*} cards
 * @return {*}
 */
export const getParent = (pathIndex, cards) => {
  const arr = indexToArray(pathIndex);
  // 嵌套节点删除
  let parent;
  arr.pop();
  if (arr.length === 0) {
    return cards;
  }
  arr.forEach((item, index) => {
    if (index === 0) {
      parent = cards[item];
    } else {
      parent = parent.children[item];
    }
  });
  if (parent.children) return parent.children;
  return parent;
};
/**
 * @description:根据路径删除数据
 * @param {*} index
 * @param {*} cards
 * @return {*}
 */
export const itemRemove = (index, cards) => {
  let parent = getParent(index, cards);
  let arr = indexToArray(index);
  let getIndex = arr.pop();
  if (parent.children) {
    parent.children.splice(getIndex, 1);
    return cards;
  }
  parent.splice(getIndex, 1);
  return cards;
};
/**
 * @description: 添加
 * @param {*} index
 * @param {*} cards
 * @param {*} item
 */
export const itemAdd = (index, cards, item) => {
  let parent = getParent(index, cards);
  let arr = indexToArray(index);
  let getIndex = arr.pop();
  if (parent.children) {
    parent.children.splice(getIndex, 0, item);
    return cards;
  }
  parent.splice(getIndex, 0, item);
  return cards;
};
/**
 * @description:根据index设置排序
 * @param {Array}  arr   节点路径的数组格式
 * @param {Array}  treeData  树节点数据
 * @param {object} param   要替换的数据
 */
export const setInfo = (arrPath, treeData, param) => {
  const arr = indexToArray(arrPath);
  treeData = _.cloneDeep(treeData);
  let parent;
  arr.forEach((item, index) => {
    if (index == 0) {
      parent = treeData[item];
    } else {
      parent = parent.children[item];
    }
  });
  parent.children = param;
  return treeData;
};

/**
 * @param {Array}  arr   节点路径的数组格式
 * @param {Array}  treeData  树节点数据
 * @param {object} param   要替换的数据
 */
export const setCurrentInfo = (arrPath, treeData, param) => {
  const arr = indexToArray(arrPath);
  treeData = _.cloneDeep(treeData);
  const delIndex = arr.pop();
  let parent;
  arr.forEach((item, index) => {
    if (index === 0) {
      parent = treeData[item];
    } else {
      parent = parent.children[item];
    }
  });
  parent.children[delIndex] = { ...param };
  return treeData;
};

/** 删除
 * @param {Array}  arr   节点路径的数组格式
 * @param {Array}  treeData  树节点数据
 * @param {object} param   要替换的数据
 */
export const deleteCurrentInfo = (arrPath, treeData) => {
  const arr = indexToArray(arrPath);
  treeData = _.cloneDeep(treeData);
  const delIndex = arr.pop();
  let parent;
  arr.forEach((item, index) => {
    if (index === 0) {
      parent = treeData[item];
    } else {
      parent = parent.children[item];
    }
  });
  //   parent.children[delIndex] = param;
  delete parent.children[delIndex];
  parent.children = parent.children.filter((item) => item);
  return treeData;
};

/**
 * @description: 判断 路径中是否都是数字
 * @param {*} pathIndex
 */
export const isPath = (pathIndex) => {
  let result = true;
  indexToArray(pathIndex).forEach((item) => {
    if (isNaN(item)) {
      result = false;
      return false;
    }
  });
  return result;
};

export const getCurrentItemIndex = (oldIndex, newIndex) => {
  const oldArr = indexToArray(oldIndex);
  const newArr = indexToArray(newIndex);
  const oldLg = oldArr.length - 1;
  const oldLastNum = oldArr[oldLg];
  const newNum = newArr[oldLg];
  if (Number(newNum) > Number(oldLastNum)) {
    newArr[oldLg] = newArr[oldLg] - 1;
    return newArr.join('-');
  }
  return newIndex;
};
// 所属第一个父级节点 存在 data-id 的
export const getParentDomDataId = (paths = []) => {
  let dom = null;
  for (const key in paths) {
    if (paths[key].getAttribute('data-id')) {
      dom = paths[key];
      break;
    }
  }
  return dom;
};
