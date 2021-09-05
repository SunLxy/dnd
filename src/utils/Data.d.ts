// controlParentType: 'Form', // 所属控件
//   controlTitle: '输入框',
//     chinaName: '输入框',
//       name: 'Input',
//         controlType: 'Input',
//           type: '', //字段类型
//             attributes: {
//   // addonAfter: "后置标签",
//   // addonBefore: "前置标签",
//   allowClear: true, // 清空图标
//     disabled: false, // 是否禁用
//       maxLength: undefined, // 最大长度
//   },
// rules: [], // 规则
import { FormItemProps } from 'antd';

export interface AttributesProps {
  /** 下拉选择-按钮组-选项组...参数 */
  options?: Array<any>;
  allowClear?: boolean;
  disabled?: boolean;
  [k: string]: any;
}

export interface DataItemProps extends FormItemProps {
  /** 所属控件 */
  controlParentType: string;
  /** 控件名称 */
  controlTitle: string;
  /** 标题 */
  chinaName: string;
  /** 控件类型  */
  controlType: string;
  /** 保存字段 */
  name: string;
  /** 保存字段类型 */
  type: string;
  // 其他 属性
  attributes: AttributesProps;
  /** 接口请求地址 */
  requestUrl?: string;
  /** 子项 */
  children?: Array<DataItemProps>;
}
