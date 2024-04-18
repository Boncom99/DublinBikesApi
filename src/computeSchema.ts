import { getTypes } from './cumpute-schema/getType';

type Types =
  | 'text'
  | 'string'
  | 'integer'
  | 'float'
  | 'date'
  | 'boolean'
  | 'unknown'
  | 'option';
type Schema = {
  display: string;
  name: string;
  type: Types;
  options: any[];
};
const camelCase = (str: string): string => {
  str = str.trim().charAt(0).toLowerCase() + str.slice(1);
  //allow ()
  return str.replace(
    /[^a-zA-Z0-9]+(.|$)/g,
    (m, chr) => chr?.toUpperCase() || '',
  );
};

export const getSchema = (content: any[]) => {
  //get the types of each key in each object
  const NameTypeSchema = getTypes(content);

  //transform the schema to the desired format
  const schema: Schema[] = Object.entries(NameTypeSchema).reduce(
    (acc, [key, type]) => {
      //check if it has options or not
      let isOption = false;
      const options: string[] = [];
      let typeOfValues: Types = type;
      if (typeOfValues === 'string') {
        //get   all the values of the key
        //and decide if it's enum or not
        const values = content.map((obj) => obj[key]);
        options.push(...new Set(values));
        if (options.length < values.length / 2) {
          isOption = true;
          typeOfValues = 'option';
        } else {
          typeOfValues = 'text';
          isOption = false;
        }
      }
      acc.push({
        display: key,
        name: camelCase(key),
        type: typeOfValues,
        options: isOption ? options : [],
      });
      return acc;
    },
    [] as Schema[],
  );
  return schema;
};
