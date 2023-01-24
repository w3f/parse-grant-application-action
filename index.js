'use strict'

const core = require('@actions/core')
const { promises: fs } = require('fs')

const main = async () => {
  const path = core.getInput('path')
  const content = await fs.readFile(path, 'utf8')

  const regexList = [
    {
      name: 'team_name',
      regex: /(?<=\*\*Team Name:\*\* ).*/g,
    },
    {
      name: 'project_name',
      regex: /(?<=^# ).*/g,
    },
    {
      name: 'contact_name',
      regex: /(?<=\*\*Contact Name:\*\* ).*/g,
    },
    {
      name: 'contact_email',
      regex: /(?<=\*\*Contact Email:\*\* ).*/g,
    },
    {
      name: 'total_cost_dai',
      regex: /(?<=\*\*Total Costs:\*\* ).*(?=( DAI)|( USD))/gi,
    },
    {
      name: 'address',
      regex: /(?<=\*\*Registered Address:\*\* ).*/g,
    },
    {
      name: 'level',
      regex: /(?<=\*\*((Level)|(\[Level\]\(https:\/\/github.com\/w3f\/Grants-Program\/tree\/master#level_slider-levels\))):\*\*.*)\d+/g,
    },
    {
      name: 'total_milestones',
      regex: /(?<=^(.*)?\# (.* )?Milestone ).*/gm,
    },
  ]

  regexList.map(function (reg) {
    try {
      switch (reg.name) {
        case 'total_milestones':
          const milestones = content.match(reg.regex)
          core.setOutput(reg.name, milestones.length)
          break
        default:
          const result = content.match(reg.regex)[0]
          core.setOutput(reg.name, result)
      }
    } catch {
      core.warning(`Match not found for: ${reg.name}`)
    }
  })
}

main().catch(err => core.setFailed(err.message))
