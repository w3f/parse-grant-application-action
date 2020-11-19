'use strict'

const core = require('@actions/core');
const { promises: fs } = require('fs');

const main = async () => {
  const path = core.getInput('path');
  const content = await fs.readFile(path, 'utf8');
  
  const regex_team_name = /(?<=\*\*Team Name:\*\* ).*/g;
  const regex_project = /(?<=\*\*Project:\*\* ).*/g;
  const regex_contact_name = /(?<=\*\*Contact Name:\*\* ).*/g;
  const regex_contact_email = /(?<=\*\*Contact Email:\*\* ).*/g;
  const regex_total_cost = /(?<=\*\*Total Costs:\*\* ).*(?= BTC)/g;
  const regex_registered_address = /(?<=\*\*Registered Address:\*\* ).*/g;

  const team_name = content.match(regex_team_name)[0];
  const project_name = content.match(regex_project)[0];
  const contact_name = content.match(regex_contact_name)[0];
  const contact_email = content.match(regex_contact_email)[0];
  const address = content.match(regex_registered_address)[0];
  const total_cost = content.match(regex_total_cost)[0];


  core.setOutput('team_name', team_name);
  core.setOutput('project_name', project_name)
  core.setOutput('contact_name', contact_name)
  core.setOutput('contact_email', contact_email)
  core.setOutput('address', address)
  core.setOutput('total_cost', total_cost)
}

main().catch(err => core.setFailed(err.message))
