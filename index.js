'use strict'

const core = require('@actions/core');
const { promises: fs } = require('fs');

const main = async () => {
  const path = core.getInput('path');
  const content = await fs.readFile(path, 'utf8');

  let regex_list = [
    /(?<=\*\*Team Name:\*\* ).*/g,
    /(?<=\*\*Project Name:\*\* ).*/g,
    /(?<=\*\*Contact Name:\*\* ).*/g,
    /(?<=\*\*Contact Email:\*\* ).*/g,
    /(?<=\*\*Total Costs:\*\* ).*(?= BTC)/g,
    /(?<=\*\*Total Costs:\*\* ).*(?= DAI)/g,
    /(?<=\*\*Registered Address:\*\* ).*/g
  ]

  let outputs = [
    'team_name',
    'project_name',
    'contact_name',
    'contact_email',
    'total_cost_btc',
    'total_cost_dai',
    'address'
  ]

  regex_list.map(function(reg, i) {
    try {
      let result = content.match(reg)[0];
      core.setOutput(outputs[i], result);
    } catch {
      core.error(`Match not found for: ${outputs[i]}`);
    }
  });
  
}

main().catch(err => core.setFailed(err.message))
