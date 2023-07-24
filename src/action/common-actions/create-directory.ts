import fs from 'fs/promises';
import createAction from '../create-action';
import logger from '../../logger';

interface CreateDirectoryPayload {
    dirPath?: string;
    dirPaths?: string[];
    recursive?: boolean;
}

const createDirectory = async (dirPath: string, recursive = false) => {
    try {
        await fs.mkdir(dirPath, { recursive });

        return '';
    } catch (err) {
        const msg = 'failed to create directory';

        logger.error({
            source: 'commonActions.createDirectory',
            msg,
            err,
            dirPath,
            recursive,
        });

        throw msg;
    }
};

export default createAction<CreateDirectoryPayload>('create-directory', async (_, payload) => {
    if (Array.isArray(payload.dirPaths)) {
        for (const path of payload.dirPaths) {
            await createDirectory(path);
        }
        return 'successful';
    }

    if (!payload.dirPath) throw 'no directory path provided';

    return createDirectory(payload.dirPath, payload.recursive);
});
