import * as core from '@actions/core'
import * as fs from 'fs'
import {wait} from './wait'
import {make} from './make'
import {parsetime} from './parsetime'
import * as exec from '@actions/exec'
import {rootSsh} from './rootssh'

const startAsync = async (callback: {
  (text: string): void
  (arg0: string): void
}): Promise<void> => {
  await exec.exec('mkdir', ['-p', '.vscode-action'])

  const makefile = make()
  fs.writeFileSync('.vscode-action/Makefile', makefile)

  await exec.exec('make', ['-C', '.vscode-action', 'download'])
  await exec.exec('make', ['-C', '.vscode-action', 'downloadNgrok'])

  await rootSsh()

  const ngrokToken: string = core.getInput('ngrok_token')
  const port: string = core.getInput('vscode_port')
  const codeServerPassword: string = core.getInput('code_server_password')
  const duration: string = core.getInput('wait_duration')

  fs.appendFileSync(
    '~/.bashrc',
    `
  export PASSWORD=${codeServerPassword}
  `
  )

  exec.exec('./.vscode-action/code-server/bin/code-server', [
    '--bind-addr',
    `127.0.0.1:${port}`,
    '--auth',
    'password'
  ])

  await exec.exec('./.vscode-action/ngrok', ['authtoken', `${ngrokToken}`])

  wait(parsetime(duration)).then(() => {
    exec.exec('sudo', ['shutdown', 'now'])
  })

  await exec.exec('./.vscode-action/ngrok', ['http', `${port}`])

  callback('Done main')
}

async function run(): Promise<void> {
  try {
    startAsync((text: string) => {
      core.debug(text)
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
