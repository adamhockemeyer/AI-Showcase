// Parameters
param webAppManagedIdentityPrincipalId string
param cognitiveServicesAccountName string


resource cognitiveServicesAccount 'Microsoft.CognitiveServices/accounts@2024-04-01-preview' existing = {
  name: cognitiveServicesAccountName
}
@description('Role definition for the Cognitive Services OpenAI User')
resource cognitiveServicesOpenAIUserRoleDefinition 'Microsoft.Authorization/roleDefinitions@2022-04-01' existing = {
  name: '5e0bd9bd-7b93-4f28-af87-19fc36ad61bd'
  scope: subscription()
}

// Create the role assignment
resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(cognitiveServicesAccount.id, webAppManagedIdentityPrincipalId, cognitiveServicesOpenAIUserRoleDefinition.id)
  scope: cognitiveServicesAccount
  properties: {
    roleDefinitionId: cognitiveServicesOpenAIUserRoleDefinition.id
    principalId: webAppManagedIdentityPrincipalId
    principalType: 'ServicePrincipal'
  }
}
