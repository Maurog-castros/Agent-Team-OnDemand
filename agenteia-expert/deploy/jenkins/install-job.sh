#!/usr/bin/env bash
# Instala el job AgenteIA-Team-Deploy en Jenkins (contenedor jenkins-devops).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
JOB_NAME="AgenteIA-Team-Deploy"
JENKINS_CONTAINER="${JENKINS_CONTAINER:-jenkins-devops}"
JOB_DIR="/var/jenkins_home/jobs/${JOB_NAME}"
TMP_CONFIG="$(mktemp)"

cleanup() { rm -f "$TMP_CONFIG"; }
trap cleanup EXIT

if ! docker ps --format '{{.Names}}' | grep -qx "$JENKINS_CONTAINER"; then
  echo "ERROR: contenedor $JENKINS_CONTAINER no está corriendo" >&2
  exit 1
fi

python3 - "$ROOT/Jenkinsfile" "$TMP_CONFIG" <<'PY'
import sys
import xml.sax.saxutils as x

jenkinsfile = open(sys.argv[1], encoding="utf-8").read()
out = sys.argv[2]

config = f"""<?xml version='1.1' encoding='UTF-8'?>
<flow-definition plugin="workflow-job@1571.1580.v18e46842c125">
  <actions>
    <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobAction plugin="pipeline-model-definition@2.2291.v2934911987b_6"/>
    <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction plugin="pipeline-model-definition@2.2291.v2934911987b_6">
      <jobProperties>
        <string>jenkins.model.BuildDiscarderProperty</string>
        <string>org.jenkinsci.plugins.workflow.job.properties.DisableConcurrentBuildsJobProperty</string>
      </jobProperties>
      <triggers/>
      <parameters>
        <string>GIT_BRANCH</string>
        <string>RUN_TESTS</string>
        <string>EXPAND_CERT</string>
      </parameters>
      <options/>
    </org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction>
  </actions>
  <description>Deploy AgenteIA Expert a team.maurocastro.cl. Ver agenteia-expert/deploy/DEPLOY.md</description>
  <keepDependencies>false</keepDependencies>
  <properties>
    <jenkins.model.BuildDiscarderProperty>
      <strategy class="hudson.tasks.LogRotator">
        <daysToKeep>30</daysToKeep>
        <numToKeep>30</numToKeep>
        <artifactDaysToKeep>-1</artifactDaysToKeep>
        <artifactNumToKeep>-1</artifactNumToKeep>
        <removeLastBuild>false</removeLastBuild>
      </strategy>
    </jenkins.model.BuildDiscarderProperty>
    <org.jenkinsci.plugins.workflow.job.properties.DisableConcurrentBuildsJobProperty>
      <abortPrevious>true</abortPrevious>
    </org.jenkinsci.plugins.workflow.job.properties.DisableConcurrentBuildsJobProperty>
    <com.coravy.hudson.plugins.github.GithubProjectProperty plugin="github@1.46.0.1">
      <projectUrl>https://github.com/Maurog-castros/Agent-Team-OnDemand/</projectUrl>
      <displayName>AgenteIA Expert — team.maurocastro.cl</displayName>
    </com.coravy.hudson.plugins.github.GithubProjectProperty>
    <hudson.model.ParametersDefinitionProperty>
      <parameterDefinitions>
        <hudson.model.ChoiceParameterDefinition>
          <name>GIT_BRANCH</name>
          <description>Rama a desplegar</description>
          <choices class="java.util.Arrays$ArrayList">
            <a class="string-array">
              <string>main</string>
            </a>
          </choices>
        </hudson.model.ChoiceParameterDefinition>
        <hudson.model.BooleanParameterDefinition>
          <name>RUN_TESTS</name>
          <description>Ejecutar tests frontend y backend antes del deploy</description>
          <defaultValue>true</defaultValue>
        </hudson.model.BooleanParameterDefinition>
        <hudson.model.BooleanParameterDefinition>
          <name>EXPAND_CERT</name>
          <description>Ampliar certificado TLS DMZ (solo si agregas subdominio)</description>
          <defaultValue>false</defaultValue>
        </hudson.model.BooleanParameterDefinition>
      </parameterDefinitions>
    </hudson.model.ParametersDefinitionProperty>
  </properties>
  <definition class="org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition" plugin="workflow-cps@4331.v9d06ed4658ff">
    <script>{x.escape(jenkinsfile)}</script>
    <sandbox>true</sandbox>
  </definition>
  <triggers/>
  <disabled>false</disabled>
</flow-definition>
"""

open(out, "w", encoding="utf-8").write(config)
PY

echo "==> Instalando job ${JOB_NAME} en ${JENKINS_CONTAINER}"
docker exec "$JENKINS_CONTAINER" mkdir -p "$JOB_DIR"
docker cp "$TMP_CONFIG" "${JENKINS_CONTAINER}:${JOB_DIR}/config.xml"
docker exec "$JENKINS_CONTAINER" chown jenkins:jenkins "${JOB_DIR}/config.xml"

echo "==> Recargando Jenkins (reinicio breve del contenedor)"
docker restart "$JENKINS_CONTAINER" >/dev/null
sleep 10

echo
echo "Job listo: https://jenkins.maurocastro.cl/job/${JOB_NAME}/"
echo "Documentación: agenteia-expert/deploy/DEPLOY.md"
