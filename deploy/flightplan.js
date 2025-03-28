// flightplan.js
var plan = require('flightplan')

// configuration
// edit this object to match your requirements!
const config = {
  deployHost: 'cumianameteo.it',
  deployPath: '/home/abidibo/www/cumianameteo',
  deployUser: 'abidibo'
}

// do not edit under this line
plan.target('production', {
  host: config.deployHost,
  username: config.deployUser,
  agent: process.env.SSH_AUTH_SOCK,
  privateKey: process.env.SSH_KEY_PATH,
})

let tmpDir = 'cumianameteo-' + new Date().getTime()

// run commands on localhost
plan.local(function (local) {
  return
  local.log('Run build')
  local.exec('yarn build')

  local.log('Copy files to remote host')
    var filesToCopy = local.exec('ls -d ../build/* ../build/*/* ../build/*/*/*', {silent: true})
  // rsync files to all the target's remote hosts
  local.with('cd ..', () => {
    local.transfer(filesToCopy, '/tmp/' + tmpDir)
  })
})

// run commands on the target's remote hosts
plan.remote(function (remote) {
  remote.log('Remove previous')
  remote.exec(`rm -r ${config.deployPath}/previous`)
  remote.log('Move current to previous')
  remote.exec(`mv ${config.deployPath}/current ${config.deployPath}/previous`)
  remote.log('Move files to current')
  remote.exec('cp -R /tmp/' + tmpDir + `/build ${config.deployPath}/current`)
  remote.rm('-rf /tmp/' + tmpDir)
})
