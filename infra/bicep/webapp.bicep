param prefix string
param location string
param tags object

resource staticWebApp 'Microsoft.Web/staticSites@2023-12-01' = {
  name: '${prefix}-app'
  location: location
  properties: {
    #disable-next-line BCP037
    areStaticSitesDistributedBackendsEnabled: true
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
