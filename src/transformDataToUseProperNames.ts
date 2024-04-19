import { properType } from './filter';
import { Schema } from './computeSchema';

export const transformDataToUseProperNames = (
  data: any[],
  schema: Schema[],
) => {
  return data.map((item) => {
    return Object.entries(item).reduce(
      (acc, [key, value]) => {
        const schemaField = schema.find((field) => field.display === key);
        if (!schemaField) {
          return acc;
        }
        acc[schemaField.name] = properType(value, schemaField.type);
        return acc;
      },
      {} as Record<string, any>,
    );
  });
};
