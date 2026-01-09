#!/usr/bin/env node
import prompts from 'prompts';
import { green, cyan, red, bold } from 'kleur/colors';
import tiged from 'tiged';
import fs from 'fs';
import path from 'path';

const REPO = 'Adam-Elmi/SomDocs-Starter';

async function main() {
    console.log(bold(cyan('\nWelcome to SomDocs Starter CLI\n')));

    let targetDirName = process.argv[2];

    if (!targetDirName) {
        const response = await prompts({
            type: 'text',
            name: 'directory',
            message: 'Where would you like to create your new project?',
            initial: 'somdocs-project'
        });
        targetDirName = response.directory;
    }

    if (!targetDirName) {
        console.log(red('Operation cancelled.'));
        process.exit(1);
    }

    const targetDir = path.resolve(process.cwd(), targetDirName);
    const relativeDir = targetDirName;

    if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
        console.log(red(`Directory "${relativeDir}" is not empty.`));
        process.exit(1);
    }

    console.log(`\nDownloading template from ${cyan(REPO)}...`);

    const emitter = tiged(REPO, {
        disableCache: true,
        force: true,
        verbose: false,
    });

    try {
        await emitter.clone(targetDir);
    } catch (err) {
        console.error(red(`Failed to clone repository: ${err.message}`));
        process.exit(1);
    }

    console.log(green('\nProject created successfully!'));
    console.log('\nNext steps:');
    console.log(`  ${cyan(`cd ${relativeDir}`)}`);
    console.log(`  ${cyan('npm install')}`);
    console.log(`  ${cyan('npm run dev')}`);
    console.log('\nHappy documenting!\n');
}

main().catch((err) => {
    console.error(red(err));
    process.exit(1);
});
