'use strict'

const core = require('@actions/core')
const { promises: fs } = require('fs')

const main = async () => {
  const path = core.getInput('path')
  const content = await fs.readFile(path, 'utf8')

  const regexList = [
    /(?<=\*\*Team Name:\*\* ).*/g,
    /(?<=^# ).*/g,
    /(?<=\*\*Contact Name:\*\* ).*/g,
    /(?<=\*\*Contact Email:\*\* ).*/g,
    /(?<=\*\*Total Costs:\*\* ).*(?= BTC)/gi,
    /(?<=\*\*Total Costs:\*\* ).*(?=( DAI)|( USD))/gi,
    /(?<=\*\*Registered Address:\*\* ).*/g,
    /(?<=\*\*((Level)|(\[Level\]\(https:\/\/github.com\/w3f\/Grants-Program\/tree\/master#level_slider-levels\))):\*\*.*)\d+/g
  ]

  const outputs = [
    'team_name',
    'project_name',
    'contact_name',
    'contact_email',
    'total_cost_btc',
    'total_cost_dai',
    'address',
    'level'
  ]

  regexList.map(function (reg, i) {
    try {
      const result = content.match(reg)[0]
      core.setOutput(outputs[i], result)
    } catch {
      core.warning(`Match not found for: ${outputs[i]}`)
    }
  })
}

main().catch(err => core.setFailed(err.message))
