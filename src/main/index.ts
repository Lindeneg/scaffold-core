import type { NodePlopAPI } from 'node-plop';
import {
    initializeGenerator,
    initializeScaffoldRegister,
    initializeCommonActions,
    initializeCommonHelpers,
} from './initialize';
import logger, { detectLogLevel } from '../logger';
import argvState from '../argv-flags/state';
import type { AnyScaffoldGenerator } from '../generator/types';

type Generators = Record<string, AnyScaffoldGenerator>;

const setPlopGenerators = (
    plop: NodePlopAPI,
    generators: Generators,
    destPath: string,
    argv: string[]
) => {
    const register = initializeScaffoldRegister(plop);
    const boundInitializeGenerator = initializeGenerator.bind(null, plop, destPath, argv, register);

    Object.values(generators).forEach((generator) => {
        if (!generator.enabled) {
            logger.verbose({
                msg: 'skipping generator',
                generator,
                source: 'main.setPlopGenerators',
            });
            return;
        }
        boundInitializeGenerator(generator);
    });
};

const setupEnvironment = (
    plop: NodePlopAPI,
    welcomeMessage = 'Welcome to Scaffold. Please choose a generator.'
) => {
    const destPath = plop.getDestBasePath();
    const argv = process.argv.slice(3);

    argvState.set(argv);
    detectLogLevel();

    logger.verbose({
        msg: 'verbose mode detected.' + ' run with lower log-level for cleaner output..',
    });

    plop.setWelcomeMessage(welcomeMessage);

    initializeCommonActions(plop);
    initializeCommonHelpers(plop);

    return [destPath, argv] as const;
};

export default (generators: Generators, welcomeMessage?: string): ((plop: NodePlopAPI) => void) =>
    (plop) => {
        const [destPath, argv] = setupEnvironment(plop, welcomeMessage);

        setPlopGenerators(plop, generators, destPath, argv);
    };
