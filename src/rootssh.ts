import * as core from '@actions/core'
import fs from 'fs'
import * as exec from '@actions/exec'

export const rootSsh = async (): Promise<string> => {
  const idRsaRoot: string = core.getInput('id_rsa_root')
  const authorizedKeys: string = core.getInput('authorized_keys')
  const sshConfig: string = core.getInput('ssh_config')

  fs.writeFileSync('.vscode-action/idRsaRoot', idRsaRoot)
  fs.writeFileSync('.vscode-action/authorized_keys', authorizedKeys)
  fs.writeFileSync('.vscode-action/sshConfig', sshConfig)

  await exec.exec('sudo', [
    'cp',
    '.vscode-action/sshConfig',
    '/root/.ssh/config'
  ])

  await exec.exec('sudo', [
    'cp',
    '.vscode-action/idRsaRoot',
    '/root/.ssh/id_rsa'
  ])

  await exec.exec('sudo', [
    'cp',
    '.vscode-action/authorized_keys',
    '/root/.ssh/authorized_keys'
  ])

  await exec.exec('sudo', ['chown', 'root.root', '/root/.ssh/id_rsa'])

  await exec.exec('sudo', ['chmod', '0600', '/root/.ssh/id_rsa'])

  await exec.exec('sudo', ['chmod', '0600', '/root/.ssh/authorized_keys'])

  exec.exec('sudo', ['ssh', '-fNT', 'r'])

  return 'done'
}
