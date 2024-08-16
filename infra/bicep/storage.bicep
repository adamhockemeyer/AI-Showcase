param name string
param tags object = {}
param containerName string = 'documents'
@description('UTC timestamp used to create distinct deployment scripts for each deployment')
param utcValue string = utcNow()

resource storage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  sku: {
    name: 'Standard_RAGRS'
  }
  kind: 'StorageV2'
  name: name
  location: resourceGroup().location
  tags: tags
  properties: {
    dnsEndpointType: 'Standard'
    defaultToOAuthAuthentication: false
    publicNetworkAccess: 'Enabled'
    allowCrossTenantReplication: false
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
    allowSharedKeyAccess: true
    largeFileSharesState: 'Enabled'
    networkAcls: {
      bypass: 'AzureServices'
      virtualNetworkRules: []
      ipRules: []
      defaultAction: 'Allow'
    }
    supportsHttpsTrafficOnly: true
    encryption: {
      requireInfrastructureEncryption: false
      services: {
        file: {
          keyType: 'Account'
          enabled: true
        }
        blob: {
          keyType: 'Account'
          enabled: true
        }
      }
      keySource: 'Microsoft.Storage'
    }
    accessTier: 'Hot'
  }
  identity: {
    type: 'SystemAssigned'
  }
}

resource blobServices 'Microsoft.Storage/storageAccounts/blobServices@2023-01-01' = {
  parent: storage
  name: 'default'
}

resource container 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  parent: blobServices
  name: containerName
  properties: {
    publicAccess: 'None'
  }
}

resource scriptContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  parent: blobServices
  name: 'scripts'
  properties: {
    publicAccess: 'None'
  }
}

resource uploadScript 'Microsoft.Resources/deploymentScripts@2020-10-01' = {
  name: 'uploadScript-${utcValue}'
  location: resourceGroup().location
  kind: 'AzureCLI'
  properties: {
    azCliVersion: '2.30.0'
    scriptContent: '''
# Count total files
totalFiles=$(find ../../files -type f | wc -l)
echo "Total files to upload: $totalFiles"

for file in $(find ../../files -type f); do
  blobName=$(basename $file)
  exists=$(az storage blob exists --account-name $storageAccountName --container-name $containerName --name $blobName --auth-mode key --account-key $storageAccountKey --query exists)
  if [ "$exists" == "false" ]; then
    az storage blob upload --account-name $storageAccountName --container-name $containerName --name $blobName --file $file --auth-mode key --account-key $storageAccountKey
  else
    echo "Skipping $file as it already exists in the blob storage."
  fi
done
'''
    environmentVariables: [
      { name: 'storageAccountName', value: storage.name }
      { name: 'containerName', value: container.name }
      { name: 'storageAccountKey', value: listKeys(storage.id, '2022-09-01').keys[0].value }
    ]
    retentionInterval: 'P1D'
    timeout: 'PT10M'
    cleanupPreference: 'OnSuccess'
    storageAccountSettings: {
      storageAccountName: storage.name
      storageAccountKey: listKeys(storage.id, '2022-09-01').keys[0].value
    }
  }
}

output storageAccountName string = storage.name
output containerName string = container.name
