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
  name: '${prefix}-ca'
  location: region
  kind: 'OpenAI'
  properties: {}
  sku: {
    name: 'S0'
  }
  tags: commonTags
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


module frontendApp 'container-app.bicep' = {
  name: 'frontend-container-app'
  dependsOn: [
    openai
  ]
  params: {
    name: 'frontend'
    tags: commonTags
    managedEnvironmentId: containerAppsEnvironment.outputs.containerAppsEnvironmentResourceId
    containerImage: 'ghcr.io/adamhockemeyer/ai-showcase-frontend:adam-dev'
    containerName: 'frontend'
    containerTargetPort: 3000
    containerMinReplicas: 1
    containerMaxRepliacs: 3
    secrets: [
      {
        name: 'AZURE_OPENAI_BASE_URL'
        value: '${cognitiveServicesAccount.properties.endpoint}}openai/deployments/'
      }
      {
        name: 'AZURE_OPENAI_API_KEY'
        value: cognitiveServicesAccount.listKeys().key1
      }
      {
        name: 'AZURE_OPENAI_DEPLOYMENT'
        value: 'gpt4-o'
      }
    ]
    containerEnvironmentVariables: [
      {
        name: 'AZURE_OPENAI_BASE_URL'
        secretRef: 'AZURE_OPENAI_BASE_URL'
      }
      {
        name: 'AZURE_OPENAI_API_KEY'
        secretRef: 'AZURE_OPENAI_API_KEY'
      }
      {
        name: 'AZURE_OPENAI_DEPLOYMENT'
        secretRef: 'AZURE_OPENAI_DEPLOYMENT'
      }
    ]
  }
}

module webapp_openai_auth './auth.bicep' = {
  name: 'webapp-openai-auth'
  params: {
    webAppManagedIdentityPrincipalId: frontendApp.outputs.principalId
    cognitiveServicesAccountName: cognitiveServicesAccount.name
  }
}
