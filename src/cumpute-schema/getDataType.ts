export type DataType =
  | 'text'
  | 'string'
  | 'integer'
  | 'float'
  | 'date'
  | 'boolean'
  | 'unknown'
  | 'option';
export type keyType = Record<string, DataType>;

const getArrayOfTypesPerKey = (
  content: any,
): Record<string, { dataTypes: DataType[]; options: string[] }> => {
  if (!Array.isArray(content)) {
    throw new Error(
      'Invalid content. This function expects an array of objects.',
    );
  }
  return content.reduce(
    (acc, obj) => {
      const keyTypePair = getTypeOfEachKeyInObject(obj);
      Object.entries(keyTypePair).forEach(([key, dataType]) => {
        if (!acc[key]) {
          acc[key] = { dataTypes: [], options: [] };
        }
        acc[key].dataTypes.push(dataType);
        if (dataType === 'string') {
          acc[key].options.push(obj[key]);
        }
      });
      return acc;
    },
    {} as Record<string, { dataTypes: DataType[]; options: string[] }>,
  );
};

const getTypeOfEachKeyInObject = (content: object): keyType => {
  if (typeof content === 'object') {
    //for each key, get the type of the value
    return Object.entries(content).reduce((acc, [key, value]) => {
      const type = getTypeOfValue(value);
      if (type === null) {
        return acc;
      }
      acc[key] = type;
      return acc;
    }, {} as keyType);
  }
  throw new Error(
    'Invalid content. This function expects an object or an array of objects.',
  );
};

function getTypeOfValue(input: any): DataType | null {
  if (input === null) {
    //all keys can have null values
    return null;
  }
  if (typeof input === 'string') {
    // Check if it's a date
    if (!isNaN(Date.parse(input))) {
      return 'date';
    }
    // Check if it's a boolean
    if (input.toLowerCase() === 'true' || input.toLowerCase() === 'false') {
      return 'boolean';
    }
    //check if the number can be parsed to integer or float
    if (Number.isInteger(parseFloat(input))) {
      return 'integer';
    }
    if (!isNaN(parseFloat(input)) && !Number.isInteger(parseFloat(input))) {
      return 'float';
    }
    // it's a string (TEXT OR OPTION)
    return 'string';
  }
  if (typeof input === 'boolean') {
    return 'boolean';
  }
  if (Number.isInteger(input)) {
    return 'integer';
  }
  if (!isNaN(parseFloat(input))) {
    return 'float';
  }
  // If none of the above matches, return 'unknown'
  return 'unknown';
}
export const getSchemasTypes = (content: any[]): keyType => {
  const arrayOfTypesAndOptionsPerKey = getArrayOfTypesPerKey(content);

  //Check if data type is "option" instead of Text
  const arrayOfTypesPerKey = Object.entries(
    arrayOfTypesAndOptionsPerKey,
  ).reduce(
    (acc, [key, { dataTypes, options }]) => {
      if (!dataTypes.includes('string')) {
        acc[key] = dataTypes;
        return acc;
      }
      //It's a string. it could be "text" or "option"
      const setOfOptions = new Set(options);
      if (setOfOptions.size < options.length / 2 && options.length > 4) {
        //all strings refer to options. (it doesn't mean that the final data type is option)
        acc[key] = dataTypes.map((t) => (t === 'string' ? 'option' : t));
        return acc;
      }
      //all strings refer to text
      acc[key] = dataTypes.map((t) => (t === 'string' ? 'text' : t));
      return acc;
    },
    {} as Record<string, DataType[]>,
  );
  //for each key
  //if all data types are the same, return that data type
  //else if there are multiple values, return the most common value if the proportion is higher than 80%
  //else, return 'unknown'
  return Object.entries(arrayOfTypesPerKey).reduce(
    (acc, [key, dataTypes]) => {
      if (dataTypes.every((t) => t === dataTypes[0])) {
        //All data types are the same
        acc[key] = dataTypes[0];
      } else {
        //There are multiple data types. lets see if we can find the most common one
        const mostCommonValue = dataTypes.sort(
          (a, b) =>
            dataTypes.filter((v) => v === a).length -
            dataTypes.filter((v) => v === b).length,
        )[0];
        const proportion =
          dataTypes.filter((val) => val === mostCommonValue).length /
          dataTypes.length;
        if (proportion > 0.85) {
          //if the most common data type is more than 85%, we consider it is the data type
          console.warn('not all the values have the same type');
          acc[key] = mostCommonValue;
        } else {
          acc[key] = 'unknown';
        }
      }
      return acc;
    },
    {} as Record<string, DataType>,
  );
};
