import createAction from '../create-action';
import { exitWithMessage } from '../../generator/logic';

export default createAction('generator-complete', () => {
    return exitWithMessage({ msg: 'Generator Done!' }, 0);
});
