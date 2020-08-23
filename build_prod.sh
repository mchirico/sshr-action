#!/bin/bash
rm -rf node_modules
npm install
npm build
git checkout -b releases/v1
git commit -a -m "prod dependencies"
npm prune --production
git add node_modules -f
git commit -a -m "prod dependencies"
git push origin releases/v1 -f
git tag -fa v1 -m "Update v1 tag"
git push origin v1 --force
rm -rf node_modules
git co master
git br -D releases/v1
npm install

