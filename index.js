'use strict'

const core = require('@actions/core')
const { promises: fs } = require('fs')

const main = async () => {
  const path = core.getInput('path')
  const content = await fs.readFile(path, 'utf8')

  // if the parser won't find a mandatory field, it will make the action fail
  // otherwise it will just warn
  const regexList = [
    {
      name: 'team_name',
      regex: /(?<=\*\*Team Name:\*\* ).*/g,
      mandatory: true,
    },
    {
      name: 'project_name',
      regex: /(?<=^# ).*/g,
      mandatory: true,
    },
    {
      name: 'contact_name',
      regex: /(?<=\*\*Contact Name:\*\* ).*/g,
      mandatory: true,
    },
    {
      name: 'contact_email',
      regex: /(?<=\*\*Contact Email:\*\* ).*/g,
      mandatory: true,
    },
    {
      name: 'total_cost_dai',
      regex: /(?<=\*\*Total Costs:\*\* ).*/g, // this will take also extra as $, USD, DAI...
      mandatory: true,
    },
    {
      name: 'address',
      regex: /(?<=\*\*Registered Address:\*\* ).*/g,
      mandatory: false,
    },
    {
      name: 'level',
      regex: /(?<=\*\*((Level)|(\[Level\]\(https:\/\/github.com\/w3f\/Grants-Program\/tree\/master#level_slider-levels\))):\*\*.*)\d+/g,
      mandatory: true,
    },
    {
      name: 'total_milestones',
      regex: /(?<=^(.*)?\# (.* )?Milestone ).*/gm,
      mandatory: true,
    },
  ]

  let is_maintenance = path.includes('maintenance')
  core.setOutput('is_maintenance', is_maintenance)

  let error_not_found = [];
  let warning_not_found = [];
  let outputs = [];

  regexList.map(function (reg) {
    try {
      switch (reg.name) {
        case 'project_name':
          const project_name = content.match(reg.regex)[0]
          if (project_name === 'W3F Grant Proposal' || project_name === 'Name of your Project' || project_name === 'W3F Maintenance Grant Proposal') {
            core.setFailed(`Project name is the default one. Please change it.`)
          } else {
            outputs.push({name: reg.name, value: project_name})
          }
          break
        case 'total_cost_dai':
          if (!is_maintenance) {
            // take only the numbers removing extra strings like $, USD, DAI...
            let total_cost_dai = content.match(reg.regex)[0].match(/\d+/g).join('')
            outputs.push({name: reg.name, value: total_cost_dai})
          } else {
            outputs.push({name: reg.name, value: "0"})
          }
          break
        case 'total_milestones':
          if (!is_maintenance) {
            const milestones = content.match(reg.regex)
            outputs.push({name: reg.name, value: milestones.length+""}) // convert to string
          } else {
            outputs.push({name: reg.name, value: "0"})
          }
          break
        default:
          const result = content.match(reg.regex)[0]
          outputs.push({name: reg.name, value: result})
      }
    } catch {
      if (reg.mandatory) {
        error_not_found.push(reg.name)
      } else {
        warning_not_found.push(reg.name)
      }
    }
  })

  if (warning_not_found.length > 0) {
    const warning_string = warning_not_found.join(', ')
    core.warning(`Non-mandatory fields missing: ${warning_string}`)
  }

  if (error_not_found.length > 0) {
    const error_string = error_not_found.join(', ')
    core.setFailed(`Mandatory fields missing: ${error_string}`)
  }

  // if setted outputs are in the form [output](link), take only "output"
  outputs.map(function (out) {
    if (out.value.includes('](')) {
      let output = out.value.split('](')[0].replace('[', '')
      core.setOutput(out.name, output)
    } else {
      core.setOutput(out.name, out.value)
    }
  })

}

main().catch(err => core.setFailed(err.message))
