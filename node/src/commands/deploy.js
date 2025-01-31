const DeployUtils = require('../lib/deploy-utils');
const logger = require('../lib/logger');
const { options } = require('../config/constants');

const { BLUEPRINT_ID, ENVIRONMENT_NAME, PROJECT_ID, WORKSPACE_NAME } = options;

const assertBlueprintExistsOnInitialDeployment = options => {
  if (!options[BLUEPRINT_ID]) throw new Error('Missing blueprint ID on initial deployment');
};

const assertNoWorkspaceNameChanges = (options, environment) => {
  if (options[WORKSPACE_NAME] && options[WORKSPACE_NAME] !== environment.workspaceName)
    throw new Error('You cannot change a workspace name once an environment has been deployed');
};

const getConfigurationChanges = environmentVariables =>
  (environmentVariables || []).map(variable => ({
    isSensitive: variable.sensitive,
    name: variable.name,
    value: variable.value,
    type: 0 // supporting only environment variable type ATM
  }));

const deploy = async (options, environmentVariables) => {
  const deployUtils = new DeployUtils();
  const configurationChanges = getConfigurationChanges(environmentVariables);

  let deployment;
  let environment = await deployUtils.getEnvironment(options[ENVIRONMENT_NAME], options[PROJECT_ID]);

  if (!environment) {
    logger.info('Initial deployment detected!');
    assertBlueprintExistsOnInitialDeployment(options);

    environment = await deployUtils.createAndDeployEnvironment(options, configurationChanges);
    deployment = environment.latestDeploymentLog;
  } else {
    assertNoWorkspaceNameChanges(options, environment);
    const optionsWithoutWorkspace = { ...options }
    delete optionsWithoutWorkspace[WORKSPACE_NAME]
    deployment = await deployUtils.deployEnvironment(environment, optionsWithoutWorkspace, configurationChanges);
  }

  const status = await deployUtils.pollDeploymentStatus(deployment);

  deployUtils.assertDeploymentStatus(status);
};

module.exports = deploy;
