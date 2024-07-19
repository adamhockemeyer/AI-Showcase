param prefix string = '${substring(uniqueString(resourceGroup().id),0,4)}-ai-showcase'
param region string = resourceGroup().location
param webAppRepositoryUrl string = 'https://github.com/adamhockemeyer/AI-Showcase'
@secure()
param gitRepoToken string
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

module openai './openai.bicep' = {
  name: 'openai'
  params: {
    prefix: prefix
    region: region
    tags: commonTags
  }
}

module webapp './webapp.bicep' = {
  name: 'webapp'
  params: {
    prefix: prefix
    location: region
    tags: commonTags
    repositoryUrl: webAppRepositoryUrl
    branch: 'main'
    repoToken: gitRepoToken
  }
}

module webapp_openai_auth './auth.bicep' = {
  name: 'webapp-openai-auth'
  params: {
    webAppManagedIdentityPrincipalId: webapp.outputs.identityPrincipalId
    cognitiveServicesAccountName: openai.outputs.cognitiveServicesAccountName
  }
}
