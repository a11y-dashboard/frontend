plan(key:'ADT',name:'Accessibility Dashboard Tests',
   description:'Tests for the a11y-dashboard') {
   project(key:'A11Y',name:'Accessibility at Atlassian')

   repository(name:'Accessibility Dashboard')

   label(name:'plan-templates')

   trigger(type:'polling',strategy:'periodically',frequency:'180') {
      repository(name:'Accessibility Dashboard')

   }
   stage(name:'Default Stage') {
      job(key:'JOB1',name:'Unit tests',description:'This runs the unit tests') {
         artifactDefinition(name:'command.log',pattern:'command.log',shared:'false')

         bitbucket_build_status_start_task()

         task(type:'checkout',description:'Checkout atlassian/a11y-dashboard') {
            repository(name:'Accessibility Dashboard')

         }
         task(type:'script',description:'Free port 5000',
            scriptBody:'''


#!/bin/bash
PID=`lsof -i :$PORT|grep LISTEN|head -n1|tr -s \' \'|cut -d\' \' -f2`
if [ -z "$PID" ] ; then
    echo "No one is occupying $PORT"
else
    kill -9 $PID
    echo "Killed $PID occupying port $PORT"
fi
exit 0


''',
            environmentVariables:'PORT="5000"')

         task(type:'npm',description:'Install dependencies',
            command:'install',executable:'Node.js 4.2')

        task(type:'npm',description:'Install wait-on',
           command:'install wait-on',executable:'Node.js 4.2')

        task(type:'npm',description:'Lint code',
           command:'run lint',executable:'Node.js 4.2')

         task(type:'script',description:'Install docker-compose',
            scriptBody:'''


set -e
curl -L -sS https://github.com/docker/compose/releases/download/$DOCKER_COMPOSE_VERSION/docker-compose-`uname -s`-`uname -m` -o docker-compose
chmod u+x docker-compose


''',
            environmentVariables:'DOCKER_COMPOSE_VERSION="1.5.0"')

         task(type:'script',description:'Run composed docker service in background',
            scriptBody:'''
set -e

screen -S a11yd -d -m bash -c "./docker-compose stop && ./docker-compose rm -f && NODE_ENV=production WEBSERVICE_URL=\"http://localhost:8080\" ./docker-compose up 2>&1|tee command.log"
function kill_a11yd {
    screen -X -S a11yd quit
}
trap kill_a11yd INT EXIT

`npm bin`/wait-on -t 300000 tcp:5000

''')

         task(type:'npm',description:'Run tests',command:'run bamboo',
            executable:'Node.js 4.2')

         task(type:'jUnitParser',description:'Unit test results',
            final:'true',resultsDirectory:'*.xml')

         bitbucket_build_status_end_task(
            type: 'xunit',
            xunit_path: 'test-results.xml'
         )
      }
   }
   branchMonitoring() {
      createBranch()

      inactiveBranchCleanup(periodInDays:'30')

      deletedBranchCleanup(periodInDays:'7')

   }
   dependencies(blockingStrategy:'blockIfUnbuildChanges',triggerForBranches:'true') {
      childPlan(planKey:'A11Y-DREL')

   }
   permissions() {
      anonymous(permissions:'read')

      loggedInUser(permissions:'read,write,build,clone,administration')

   }
}
