param prefix string
param region string
param tags object
// Models to deploy
param deployments array = [
  {
    name: 'gpt-35-turbo'
    model: {
      format: 'OpenAI'
      name: 'gpt-35-turbo'
      version: '0613'
    }
    sku: {
      name: 'Standard'
      capacity: 20
    }
  }
  {
    name: 'gpt-4o'
    model: {
      format: 'OpenAI'
      name: 'gpt-4o'
      version: '2024-05-13'
    }
    sku: {
      name: 'Standard'
      capacity: 20
    }
  }
  {
    name: 'text-embedding-large'
    model: {
      format: 'OpenAI'
      name: 'text-embedding-3-large'
      version: '1'
    }
    sku: {
      name: 'Standard'
      capacity: 20
    }
  }
  {
    name: 'text-embedding-small'
    model: {
      format: 'OpenAI'
      name: 'text-embedding-3-small'
      version: '1'
    }
    sku: {
      name: 'Standard'
      capacity: 20
    }
  }
]

resource cognitiveServicesAccount 'Microsoft.CognitiveServices/accounts@2024-04-01-preview' = {
  name: '${prefix}-ca'
  location: region
  kind: 'OpenAI'
  properties: {}
  sku: {
    name: 'S0'
  }
  tags: tags
}

@batchSize(1)
resource deployment 'Microsoft.CognitiveServices/accounts/deployments@2024-04-01-preview' = [
  for deployment in deployments: {
    parent: cognitiveServicesAccount
    name: deployment.name
    sku: {
      name: deployment.sku.name
      capacity: deployment.sku.capacity
    }
    properties: {
      model: deployment.model
      raiPolicyName: 'Microsoft.Default'
      versionUpgradeOption: 'OnceNewDefaultVersionAvailable'
    }
  }
]

output cognitiveServicesAccountName string = cognitiveServicesAccount.name