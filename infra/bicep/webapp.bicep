param prefix string
param location string
param tags object
param repositoryUrl string
param branch string = 'main'
@secure()
param repoToken string


resource staticWebApp 'Microsoft.Web/staticSites@2023-12-01' = {
  name: '${prefix}-app'
  location: location
  properties: {
    #disable-next-line BCP037
    areStaticSitesDistributedBackendsEnabled: true
    repositoryUrl: 'https://github.com/adamhockemeyer/AI-Showcase'
    repositoryToken: repoToken
    branch: branch
    buildProperties: {
      appLocation: 'frontend'
      apiLocation: ''
      outputLocation: '.next/standalone'
    
    }
  }
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }

  identity: {
    type: 'SystemAssigned'
  }
  tags: tags
}

output identityPrincipalId string = staticWebApp.identity.principalId
