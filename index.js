'use strict'

const core = require('@actions/core');
const { promises: fs } = require('fs');

const main = async () => {
  const path = core.getInput('path');
  const content = await fs.readFile(path, 'utf8');

  const regex_project = /(?<=\*\*Project:\*\* ).*/g;
  const regex_proposer = /(?<=\*\*Proposer:\*\* ).*/g;

  const project_name = content.match(regex_project)[0];
  const proposer = content.match(regex_proposer)[0];
  core.setOutput('project_name', project_name);
  core.setOutput('proposer', proposer);
}

main().catch(err => core.setFailed(err.message))
