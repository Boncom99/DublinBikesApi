import { Schema } from './computeSchema';
import { DataType } from './cumpute-schema/getDataType';

export type filterOperator = 'eq' | 'lt' | 'gt';
export type filter = Record<
  string,
  {
    eq?: any;
    lt?: any;
    gt?: any;
  }
>;
const a: filter = { a: { eq: 1 } };
// Define the type guard function

export const properType = (value: any, type: DataType) => {
  switch (type) {
    case 'integer':
      if (typeof value === 'string') {
        return parseInt(value);
      }
      if (typeof value === 'number') {
        return Math.round(value);
      }
      if (!isNaN(Number(value))) {
        return Math.round(Number(value));
      }
      return null;
    case 'float':
      if (typeof value === 'string') {
        return parseFloat(value);
      }
      if (typeof value === 'number') {
        return value;
      }
      if (!isNaN(Number(value))) {
        return Number(value);
      }
      return null;
    case 'boolean':
      if (typeof value === 'boolean') {
        return value;
      }
      if (typeof value === 'string') {
        return value.toLowerCase() === 'true';
      }
      if (typeof value === 'number') {
        return value === 1;
      }
      return null;
    case 'date':
      if (typeof value === 'string') {
        return new Date(value);
      }
      if (typeof value === 'number') {
        return new Date(value);
      }
      if (value instanceof Date) {
        return value;
      }
      return null;
    case 'text':
      if (typeof value === 'string') {
        return value;
      }
      return value.toString();
    case 'option':
      if (typeof value === 'string') {
        return value;
      }
      return value.toString();
    default:
      return value;
  }
};
export const applyFilter = (data: any[], filters: filter, schema: Schema[]) => {
  let filteredData = [...data];
  for (const [fieldKey, filterContent] of Object.entries(filters)) {
    const operator = Object.keys(filterContent)[0];
    const filterValue = Object.values(filterContent)[0];

    filteredData = filteredData.filter((item) => {
      const itemValue = item[fieldKey];
      if (itemValue === null) {
        return false;
      }
      switch (operator) {
        case 'eq':
          if (itemValue !== filterValue) return false;
          break;
        case 'gt':
          if (itemValue <= filterValue) return false;
          break;
        case 'lt':
          if (itemValue >= filterValue) return false;
      }
      return true;
    });
  }
  return filteredData;
};
