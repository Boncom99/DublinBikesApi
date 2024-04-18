export type Types = 'text'|'string' | 'integer' | 'float' | 'date' | 'boolean' | 'unknown'| 'option'
export type keyType = Record<string,Types>
export type keyTypes= Record<string,Types[]>
const getTypesInArray= (content: object[]):keyType[]=>{
    return content.reduce((acc ,obj)=>{
        const keyTypePair= getTypesInObject(obj)
        Object.entries(keyTypePair).forEach(([key,value])=>{
            if(!acc[key]){
                acc[key]=[]
            }
            acc[key].push(value)
        })
        return acc
    },{} as Record<string,Types[]>)
}
const getTypesInObject= (content: object ):keyType =>{
    if(typeof content === 'object'){
        //for each key, get the type of the value
        return Object.entries(content).reduce((acc,[key,value])=>{
            const type=getTypeOfValue(value)
            if(type===null){
                return acc
            }
            acc[key]= type
            return acc
        },{}as keyType)
    }
    throw new Error('Invalid content. This function expects an object or an array of objects.')
}

function getTypeOfValue(input:any):Types|null {
    if(input === null){
        //all keys can have null values
        return null
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
        if (!isNaN(parseFloat(input)) &&!Number.isInteger(parseFloat(input))) {
            return 'float';
        }
        // it's a string (TEXT OR OPTION)
        return 'string';
    }
    if(typeof input === 'boolean'){
        return 'boolean'
    }
    if (Number.isInteger(input)) {
        return 'integer';
    } if (!isNaN(parseFloat(input))) {
        return 'float';
    }
    // If none of the above matches, return 'unknown'
    return 'unknown';
}
export const getTypes=(content:any[]):keyType=> {
    const typesOfObjects = getTypesInArray(content)  //array of ojects,
//group by keys. result is an object with the key as the key and the value as an array of types
    const groupTypesByKeys = typesOfObjects.reduce((acc, obj) => {
        Object.entries(obj).forEach(([key, value]) => {
            if (value === null) {
                return
            }
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(value);
        });
        return acc;
    }, {} as Record<string, Types[]>);
//for each key
//if all types are the same, return that type
//else if there are multiple values, return the most common value if the proportion is higher than 80%
//else, return 'unknown'
   return Object.entries(groupTypesByKeys).reduce((acc, [key, values]) => {

        if (values.every(val => val === values[0])) {
            if (values[0] === null) {
                //should not happen
                return acc
            }
            acc[key] = values[0]
            return acc
        }
        const mostCommonValue = values.sort((a, b) =>
            values.filter(v => v === a).length - values.filter(v => v === b).length
        )[0]
        const proportion = values.filter(val => val === mostCommonValue).length / values.length
        if (proportion > 0.8) {
            acc[key] = mostCommonValue
            return acc
        }
        acc[key] = 'unknown'
        return acc
    }, {} as Record<string, Types>)
}