param name string
param tags object = {}

resource aisearch 'Microsoft.Search/searchServices@2024-06-01-preview' = {
  name: name
  location: resourceGroup().location
  tags: tags
  properties: {
    replicaCount: 1
    partitionCount: 1
    hostingMode: 'default'
    publicNetworkAccess: 'Enabled'
    networkRuleSet: {
      ipRules: []
      bypass: 'None'
    }
    disableLocalAuth: false
    authOptions: {
      aadOrApiKey: {}
    }
    disabledDataExfiltrationOptions: []
    semanticSearch: 'free'
  }
  sku: {
    name: 'basic'
  }
  identity: {
    type: 'SystemAssigned'
  }
}

output id string = aisearch.id
output endpoint string = 'https://${name}.search.windows.net/'
output name string = aisearch.name
