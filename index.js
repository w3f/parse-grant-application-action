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
      regex: /(?<=\*\*Total Costs:\*\* ).*/g, // this will take also extra as $, USD, DAI...
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

  let not_found = [];

  regexList.map(function (reg) {
    try {
      switch (reg.name) {
        case 'project_name':
          const project_name = content.match(reg.regex)[0]
          if (project_name == "W3F Grant Proposal" || project_name == "Name of your Project") {
            core.setFailed(`Project name is the default one. Please change it.`)
          } else {
            core.setOutput(reg.name, project_name)
          }
        case 'total_cost_dai':
          // take only the numbers removing extra strings like $, USD, DAI...
          let total_cost_dai = content.match(reg.regex)[0].match(/\d+/g).join('')
          core.setOutput(reg.name, total_cost_dai)
          break
        case 'total_milestones':
          const milestones = content.match(reg.regex)
          core.setOutput(reg.name, milestones.length)
          break
        default:
          const result = content.match(reg.regex)[0]
          core.setOutput(reg.name, result)
      }
    } catch {
      not_found.push(reg.name)
    }
  })

  if (not_found.length > 0) {
    const error_string = not_found.join(', ')
    core.setFailed(`Match not found for: ${error_string}`)
  }
}

main().catch(err => core.setFailed(err.message))
