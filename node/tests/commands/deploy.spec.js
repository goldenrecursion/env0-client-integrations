const deploy = require('../../src/commands/deploy');
const DeployUtils = require('../../src/lib/deploy-utils');
const { options } = require('../../src/config/constants');

const { ENVIRONMENT_NAME, PROJECT_ID, ORGANIZATION_ID, BLUEPRINT_ID, REVISION, WORKSPACE_NAME } = options;

const mockOptions = {
  [PROJECT_ID]: 'project0',
  [ENVIRONMENT_NAME]: 'environment0',
  [ORGANIZATION_ID]: 'organization0'
};

const mockOptionsWithRequired = {
  ...mockOptions,
  [WORKSPACE_NAME]: 'workspace0',
  [BLUEPRINT_ID]: 'blueprint0',
  [REVISION]: 'revision0'
};

const mockGetEnvironment = jest.fn();
const mockCreateAndDeployEnvironment = jest.fn();
const mockDeployEnvironment = jest.fn();

jest.mock('../../src/lib/deploy-utils');
jest.mock('../../src/lib/logger');

describe('deploy', () => {
  beforeEach(() => {
    DeployUtils.mockImplementation(() => ({
      getEnvironment: mockGetEnvironment,
      createAndDeployEnvironment: mockCreateAndDeployEnvironment,
      deployEnvironment: mockDeployEnvironment,
      pollDeploymentStatus: jest.fn(),
      assertDeploymentStatus: jest.fn()
    }));
  });

  beforeEach(() => {
    mockDeployEnvironment.mockResolvedValue({ id: 'deployment0' });
    mockCreateAndDeployEnvironment.mockResolvedValue({ latestDeploymentLogId: 'deployment0' });
  });

  it('should get environment', async () => {
    await deploy(mockOptionsWithRequired);

    expect(mockGetEnvironment).toBeCalledWith(mockOptions[ENVIRONMENT_NAME], mockOptions[PROJECT_ID]);
  });

  it("should create environment when it doesn't exist", async () => {
    mockGetEnvironment.mockResolvedValue(undefined);

    await deploy(mockOptionsWithRequired);
    expect(mockCreateAndDeployEnvironment).toBeCalledWith(mockOptionsWithRequired, []);
  });

  describe('proper set of configuration changes', () => {
    const environmentVariables = [
      {
        name: 'foo',
        value: 'bar',
        sensitive: false
      },
      {
        name: 'baz',
        value: 'waldo',
        sensitive: true
      }
    ];

    const expectedConfigurationChanges = environmentVariables.map(variable => ({
      name: variable.name,
      value: variable.value,
      isSensitive: variable.sensitive,
      type: 0
    }));

    it('on initial deploy', async () => {
      mockGetEnvironment.mockResolvedValue(undefined);

      await deploy(mockOptionsWithRequired, environmentVariables);

      expect(mockCreateAndDeployEnvironment).toBeCalledWith(mockOptionsWithRequired, expectedConfigurationChanges);
    });

    it('should redeploy with arguments', async () => {
      const mockEnvironment = { id: 'environment0' };
      mockGetEnvironment.mockResolvedValue(mockEnvironment);
      const redeployOptions = { ...mockOptionsWithRequired, [WORKSPACE_NAME]: undefined };
      await deploy(redeployOptions, environmentVariables);

      expect(mockDeployEnvironment).toBeCalledWith(mockEnvironment, redeployOptions, expectedConfigurationChanges);
    });

    it('should not allow to redeploy with workspace name set', async () => {
      const mockEnvironment = { id: 'environment0' };
      mockGetEnvironment.mockResolvedValue(mockEnvironment);

      await expect(deploy({ [WORKSPACE_NAME]: 'workspace0' }, environmentVariables)).rejects.toThrowError(
        'You may only set Terraform Workspace on the first deployment of an environment'
      );
    });
  });

  it('should fail when blueprint is missing on initial deployment', async () => {
    mockGetEnvironment.mockResolvedValue(undefined);

    await expect(deploy(mockOptions)).rejects.toThrow(
      expect.objectContaining({ message: 'Missing blueprint ID on initial deployment' })
    );
  });
});
