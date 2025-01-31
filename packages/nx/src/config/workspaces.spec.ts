import { toProjectName } from './workspaces';
import { TempFs } from '../internal-testing-utils/temp-fs';
import { withEnvironmentVariables } from '../internal-testing-utils/with-environment';
import { retrieveProjectConfigurations } from '../project-graph/utils/retrieve-workspace-files';
import { readNxJson } from './configuration';
import { loadNxPlugins } from '../project-graph/plugins/internal-api';

describe('Workspaces', () => {
  let fs: TempFs;
  beforeEach(() => {
    fs = new TempFs('Workspaces');
  });
  afterEach(() => {
    fs.cleanup();
  });

  describe('to project name', () => {
    it('should lowercase names', () => {
      const appResults = toProjectName('my-apps/directory/my-app/package.json');
      const libResults = toProjectName('packages/directory/MyLib/package.json');
      expect(appResults).toEqual('my-app');
      expect(libResults).toEqual('mylib');
    });

    it('should use the workspace globs in package.json', async () => {
      await fs.createFiles({
        'packages/my-package/package.json': JSON.stringify({
          name: 'my-package',
        }),
        'package.json': JSON.stringify({
          name: 'package-name',
          workspaces: ['packages/**'],
        }),
      });

      const { projects } = await withEnvironmentVariables(
        {
          NX_WORKSPACE_ROOT_PATH: fs.tempDir,
        },
        async () => {
          const [plugins, cleanup] = await loadNxPlugins(
            readNxJson(fs.tempDir).plugins,
            fs.tempDir
          );
          const res = retrieveProjectConfigurations(
            plugins,
            fs.tempDir,
            readNxJson(fs.tempDir)
          );
          cleanup();
          return res;
        }
      );
      console.log(projects);
      expect(projects['packages/my-package']).toEqual({
        name: 'my-package',
        root: 'packages/my-package',
        sourceRoot: 'packages/my-package',
        projectType: 'library',
        targets: {
          'nx-release-publish': {
            configurations: {},
            dependsOn: ['^nx-release-publish'],
            executor: '@nx/js:release-publish',
            options: {},
          },
        },
      });
    });
  });
});
