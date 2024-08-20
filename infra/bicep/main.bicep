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
        value: 'https://${phi3mediumApp.outputs.fqdn}'
      }
      {
        name: 'promptflow-basic-rag-url'
        value: 'https://${promptflowBasicRagApp.outputs.fqdn}'
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
      {
        name: 'PROMPTFLOW_BASIC_RAG_URL'
        secretRef: 'promptflow-basic-rag-url'
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

module search './search.bicep' = {
  name: 'search'
  params: {
    name: '${prefix}-search'
    tags: commonTags
  }
}

module storage './storage.bicep' = {
  name: 'storage'
  params: {
    name: replace(replace('${prefix}storage', '-', ''), '_', '')
    tags: commonTags
  }
}


module promptflowBasicRagApp 'container-app.bicep' = {
  name: 'promptflow-basic-rag-container-app'
  dependsOn: [
    search
  ]
  params: {
    name: 'promptflow-basic-rag'
    tags: commonTags
    managedEnvironmentId: containerAppsEnvironment.outputs.containerAppsEnvironmentResourceId
    workloadProfileName: containerAppsEnvironment.outputs.consumptionWorkloadProfileName
    containerImage: 'ghcr.io/adamhockemeyer/ai-showcase-promptflowbasicrag:adam-dev'
    containerName: 'promptflow-basic-rag'
    containerTargetPort: 8080
    containerMinReplicas: 1
    containerMaxRepliacs: 3
    containerResourcesCPU: '1'
    containerResourcesMemory: '2Gi'
    secrets: [
      {
        name: 'open-ai-connection-api-key'
        value: cognitiveServicesAccount.listKeys().key1
      }
    ]
    containerEnvironmentVariables: [
      {
        name: 'OPEN_AI_CONNECTION_API_KEY'
        secretRef: 'open-ai-connection-api-key'
      }
    ]
  }
}


module searchRoleUser 'role.bicep' = {
  name: 'search-role-user'
  params: {
    principalId: promptflowBasicRagApp.outputs.principalId
    roleDefinitionId: '1407120a-92aa-4202-b7e9-c0e197c71c8f'
    principalType: 'ServicePrincipal'
  }
}

module searchContribRoleUser 'role.bicep' = {
  name: 'search-contrib-role-user'
  params: {
    principalId: promptflowBasicRagApp.outputs.principalId
    roleDefinitionId: '8ebe5a00-799e-43f5-93ac-243d3dce84a7'
    principalType: 'ServicePrincipal'
  }
}

module searchSvcContribRoleUser 'role.bicep' = {
  name: 'search-svccontrib-role-user'
  params: {
    principalId: promptflowBasicRagApp.outputs.principalId
    roleDefinitionId: '7ca78c08-252a-4471-8644-bb5ff32d4ba0'
    principalType: 'ServicePrincipal'
  }
}
