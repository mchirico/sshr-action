# sshr-action
vscode into Github Actions for troubleshooting

You'll need the following secrets:

![image](https://user-images.githubusercontent.com/755710/90981110-3f821480-e52d-11ea-978b-764a0dd47d16.png)

## Example .ssh/config

```
Host r
Hostname remote.mydomain.io
        User User32
        ControlMaster auto
        ForwardX11Trusted yes
        ForwardX11 yes
        RemoteForward 2222 localhost:22
        IdentityFile /root/.ssh/id_rsa
        StrictHostKeyChecking no
        ServerAliveInterval 30


```
