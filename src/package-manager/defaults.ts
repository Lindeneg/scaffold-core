import createPackageManager from './create-package-manager';

export default {
    npm: createPackageManager({
        name: 'npm',
        formattedName: 'NPM',
        enabled: true,
        installCommand: 'install',
        addCommand: 'install',
        runCommand: 'run',
        devFlag: '--save-dev',
        peerFlag: '--save-peer',
        exactFlag: '--save-exact',
        argvFlagSeparator: '--',
    }),
    yarn: createPackageManager({
        name: 'yarn',
        formattedName: 'Yarn',
        enabled: true,
        installCommand: 'install',
        addCommand: 'add',
        runCommand: 'run',
        devFlag: '--dev',
        peerFlag: '--peer',
        exactFlag: '--exact',
    }),
};
