import nodePath from 'path';
import { safeStringsOnly } from './logic';
import type { ScaffoldTemplate } from './types';

type ScaffoldPartialObject<TPartials extends readonly string[]> = Record<TPartials[number], TPartials[number]>;

const getFileName = (path: string, templateFile: string): string => {
    if (nodePath.extname(path)) return path;

    const splittedFileName = templateFile.split('/');
    const fileName = splittedFileName[splittedFileName.length - 1].replace('.hbs', '');

    return nodePath.join(path, fileName);
};

const mergePresetsWithOptions = <TPresets extends Record<string, any>, TOptions extends Record<string, any>>(
    presets: TPresets,
    options: TOptions
) => {
    const result: Record<PropertyKey, unknown> = {};
    const visited = new Set<PropertyKey>();

    Object.keys(options).forEach((key) => {
        visited.add(key);
        const pre = presets[key];
        const val = options[key];
        const typeofPre = typeof pre;

        if (typeof val === 'object' && (typeofPre === 'undefined' || typeofPre === 'object')) {
            result[key] = {
                ...(pre || {}),
                ...val,
            };
            return;
        }

        result[key] = val;
    });

    Object.keys(presets).forEach((key) => {
        if (visited.has(key)) return;
        result[key] = presets[key];
    });

    return result as TPresets & TOptions;
};

const createTemplate = <TData extends Record<string, any>, TPartials extends readonly string[]>({
    templateFile,
    partials,
    data,
}: {
    data: Partial<TData>;
    templateFile: string;
    partials?: TPartials;
}): ScaffoldTemplate<TData, ScaffoldPartialObject<TPartials>> => {
    return {
        partials: !partials
            ? ({} as never)
            : partials.reduce((obj, cur) => {
                  obj[<TPartials[number]>cur] = cur;
                  return obj;
              }, {} as ScaffoldPartialObject<TPartials>),

        addFile(path, payload) {
            const parsedData = safeStringsOnly(mergePresetsWithOptions(data, payload));
            return [
                {
                    type: 'add',
                    templateFile,
                    path: getFileName(path, templateFile),
                    data: parsedData,
                },
            ];
        },
    };
};

export default createTemplate;
