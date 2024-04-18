import { DataType, getSchemasTypes } from './cumpute-schema/getDataType';

type Schema = {
  display: string;
  name: string;
  type: DataType;
  options: any[];
};
const getCamelCaseAndClean = (str: string): string => {
  str = str.trim().charAt(0).toLowerCase() + str.slice(1);
  return str.replace(
    /[^a-zA-Z0-9]+(.|$)/g,
    (m, chr) => chr?.toUpperCase() || '',
  );
};

export const getSchema = (content: any[]) => {
  //get the data type of each key
  const KeyAndType = getSchemasTypes(content);

  const schema: Schema[] = Object.entries(KeyAndType).map(([key, type]) => {
    let options: string[] = [];
    if (type === 'option') {
      options = [...new Set(content.map((obj) => obj[key]))];
    }
    return {
      display: key,
      name: getCamelCaseAndClean(key),
      type: type,
      options: options,
    };
  });
  return schema;
};
