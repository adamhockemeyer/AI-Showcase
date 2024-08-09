param prefix string = '${substring(uniqueString(resourceGroup().id),0,4)}-ai-showcase'
param region string = resourceGroup().location
param commonTags object = {
  created_by: 'bicep'
  project: 'AI Showcase'
}

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  #disable-next-line BCP334
  name: '${prefix}-la'
  location: region
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
  tags: commonTags
}

resource cognitiveServicesAccount 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: '${prefix}-oai'
  location: region
  kind: 'OpenAI'
  properties: {
    customSubDomainName: '${prefix}-oai'
  }
  sku: {
    name: 'S0'
  }
  tags: commonTags
  identity: {
    type: 'SystemAssigned'
  }
}

module openai './openai.bicep' = {
  name: 'openai'
  params: {
    cognitiveServicesAccountName: cognitiveServicesAccount.name
  }
}

module containerAppsEnvironment './container-app-environment.bicep' = {
  name: 'container-app-environment'
  params: {
    containerAppsName: prefix
    workspaceResourceName: logAnalytics.name
    tags: commonTags
  }
}

module phi3mediumApp 'container-app.bicep' = {
  name: 'phi3medium-container-app'
  params: {
    name: 'phi3medium'
    tags: commonTags
    managedEnvironmentId: containerAppsEnvironment.outputs.containerAppsEnvironmentResourceId
    workloadProfileName: containerAppsEnvironment.outputs.dedicatedD4WorkloadProfileName
    containerImage: 'ghcr.io/adamhockemeyer/ai-showcase-phi3medium:main'
    containerName: 'phi3medium'
    containerTargetPort: 11434
    containerMinReplicas: 1
    containerMaxRepliacs: 3
    containerResourcesCPU: '4'
    containerResourcesMemory: '16Gi'
  }
}

module frontendApp 'container-app.bicep' = {
  name: 'frontend-container-app'
  dependsOn: [
    openai
    phi3mediumApp
  ]
  params: {
    name: 'frontend'
    tags: commonTags
    managedEnvironmentId: containerAppsEnvironment.outputs.containerAppsEnvironmentResourceId
    workloadProfileName: containerAppsEnvironment.outputs.consumptionWorkloadProfileName
    containerImage: 'ghcr.io/adamhockemeyer/ai-showcase-frontend:adam-dev'
    containerName: 'frontend'
    containerTargetPort: 3000
    containerMinReplicas: 1
    containerMaxRepliacs: 3
    secrets: [
      {
        name: 'azure-openai-base-url'
        value: cognitiveServicesAccount.properties.endpoint
      }
      {
        name: 'azure-openai-api-key'
        value: cognitiveServicesAccount.listKeys().key1
      }
      {
        name: 'azure-openai-deployment'
        value: 'gpt-4o'
      }
      {
        name: 'ollama-phi3medium-url'
        value: phi3mediumApp.outputs.fqdn
      }
    ]
    containerEnvironmentVariables: [
      {
        name: 'AZURE_OPENAI_BASE_URL'
        secretRef: 'azure-openai-base-url'
      }
      {
        name: 'AZURE_OPENAI_API_KEY'
        secretRef: 'azure-openai-api-key'
      }
      {
        name: 'AZURE_OPENAI_DEPLOYMENT'
        secretRef: 'azure-openai-deployment'
      }
      {
        name: 'OLLAMA_PHI3MEDIUM_URL'
        secretRef: 'ollama-phi3medium-url'
      }
    ]
  }
}

output frontendUrl string = frontendApp.outputs.fqdn

module webapp_openai_auth './auth.bicep' = {
  name: 'webapp-openai-auth'
  params: {
    webAppManagedIdentityPrincipalId: frontendApp.outputs.principalId
    cognitiveServicesAccountName: cognitiveServicesAccount.name
  }
}
