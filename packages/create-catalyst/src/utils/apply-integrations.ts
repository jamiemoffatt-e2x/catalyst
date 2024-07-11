import { readJsonSync } from 'fs-extra/esm';
import { downloadTemplate } from 'giget';
import { addDependency, addDevDependency } from 'nypm';
import { join } from 'path';
import { simpleGit, SimpleGit } from 'simple-git';
import * as z from 'zod';

import { spinner } from './spinner';

export async function applyIntegrations(
  integrations: string[] | undefined,
  { projectDir }: { projectDir: string },
) {
  if (!integrations) {
    console.log('No integrations to apply');

    return;
  }

  if (integrations.length > 1) {
    console.warn('Applying multiple integrations is not supported yet');
  }

  const integration = integrations[0];
  const integrationDir = join(projectDir, 'integrations', integration);

  await spinner(
    downloadTemplate(
      // @todo point to main branch
      `github:bigcommerce/catalyst/integrations/${integration}#wip/integrations-cli`,
      {
        dir: integrationDir,
        offline: false,
      },
    ),
    {
      text: `Cloning ${integration} integration...`,
      successText: `${integration} integration cloned successfully`,
      failText: (err) => `Failed to clone ${integration} integration: ${err.message}`,
    },
  );

  const manifest = z
    .object({
      dependencies: z.array(z.string()),
      devDependencies: z.array(z.string()),
      environmentVariables: z.array(z.string()),
    })
    .parse(readJsonSync(join(integrationDir, 'manifest.json')));

  if (manifest.dependencies.length) {
    await spinner(
      addDependency(manifest.dependencies, {
        cwd: projectDir,
        silent: true,
        // @todo: get package manager from project
        packageManager: 'pnpm',
      }),
      {
        text: 'Installing integration dependencies...',
        successText: 'Integration Dependencies installed successfully',
        failText: (err) => `Failed to install dependencies: ${err.message}`,
      },
    );
  }

  if (manifest.devDependencies.length) {
    await spinner(
      addDevDependency(manifest.devDependencies, {
        cwd: projectDir,
        silent: true,
        // @todo get package manager from project
        packageManager: 'pnpm',
      }),
      {
        text: 'Installing integration development dependencies...',
        successText: 'Integration development dependencies installed successfully',
        failText: (err) => `Failed to install integration development dependencies: ${err.message}`,
      },
    );
  }

  const git: SimpleGit = simpleGit();

  await spinner(
    git.applyPatch(join(integrationDir, 'integration.patch'), {
      '-p': 2,
    }),
    {
      text: 'Applying integration patch...',
      successText: 'Integration patch applied successfully',
      failText: (err) => `Failed to apply integration patch: ${err.message}`,
    },
  );
}
