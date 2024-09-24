@description('The name of the API Management instance to deploy this API to.')
param serviceName string
param endpoint string
param backendName string
param apimLoggerName string

resource apimService 'Microsoft.ApiManagement/service@2023-09-01-preview' existing = {
  name: serviceName
}

var aoaiSwagger = loadTextContent('./azure-openai-2024-06-01.json')
var aoaiSwaggerUrl = replace(aoaiSwagger, 'https://{endpoint}/openai', 'https://${endpoint}/openai')
var aoaiSwaggerDefault = replace(aoaiSwaggerUrl, 'your-resource-name.openai.azure.com', '${serviceName}')

resource apiDefinition 'Microsoft.ApiManagement/service/apis@2023-09-01-preview' = {
  name: 'azure-openai'
  parent: apimService
  properties: {
    path: 'openai'
    description: 'See https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/stable/2024-06-01/inference.json'
    displayName: 'azure-openai'
    format: 'openapi+json'
    value: aoaiSwaggerDefault
    subscriptionRequired: true
    type: 'http'
    protocols: ['https']
    //serviceUrl: empty(backendName) ? 'https://${endpoint}/openai' : ''
  }
}

var policy1 = '''
    <policies>
      <inbound>
        <base />
        '''
var policy2 = '<set-backend-service backend-id="${backendName}" />'

var policy3 = '''
      <authentication-managed-identity resource="https://cognitiveservices.azure.com" output-token-variable-name="managed-id-access-token" ignore-error="false" />
      <set-header name="Authorization" exists-action="override">
          <value>@("Bearer " + (string)context.Variables["managed-id-access-token"])</value>
      </set-header>
      <azure-openai-token-limit counter-key="@(context.Subscription.Id)" tokens-per-minute="150000" estimate-prompt-tokens="true" tokens-consumed-header-name="x-request-tokens-consumed" tokens-consumed-variable-name="tokensConsumed" remaining-tokens-variable-name="remainingTokens" />
      <azure-openai-emit-token-metric namespace="openai">
            <dimension name="Subscription ID" value="@(context.Subscription.Id)" />
            <dimension name="Client IP" value="@(context.Request.IpAddress)" />
            <dimension name="API ID" value="@(context.Api.Id)" />
            <dimension name="User ID" value="@(context.Request.Headers.GetValueOrDefault("x-user-id", "N/A"))" />
        </azure-openai-emit-token-metric>
      </inbound>
      <backend>
        <!--Set count to one less than the number of backends in the pool to try all backends until the backend pool is temporarily unavailable.-->
        <retry count="2" interval="0" first-fast-retry="true" condition="@(context.Response.StatusCode == 429 || (context.Response.StatusCode == 503 && !context.Response.StatusReason.Contains("Backend pool") && !context.Response.StatusReason.Contains("is temporarily unavailable")))">
            <forward-request buffer-request-body="true" />
        </retry>
      </backend>
      <outbound>
        <base />
      </outbound>
      <on-error>
        <base />
      </on-error>
    </policies>
    '''

resource apiPolicy 'Microsoft.ApiManagement/service/apis/policies@2023-09-01-preview' = {
  name: 'policy'
  parent: apiDefinition
  properties: {
    format: 'rawxml'
    value: concat(policy1, policy2, policy3)
  }
}

var logSettings = {
  headers: [
    'Content-type'
    'User-agent'
    'x-ms-region'
    'x-ratelimit-remaining-tokens'
    'x-ratelimit-remaining-requests'
  ]
  body: { bytes: 8192 }
}

resource apimLogger 'Microsoft.ApiManagement/service/loggers@2023-09-01-preview' existing = if (!empty(apimLoggerName)) {
  name: apimLoggerName
  parent: apimService
}

resource apiDiagnostics 'Microsoft.ApiManagement/service/apis/diagnostics@2022-08-01' = if (!empty(apimLogger.name)) {
  name: 'applicationinsights'
  parent: apiDefinition
  properties: {
    alwaysLog: 'allErrors'
    httpCorrelationProtocol: 'W3C'
    logClientIp: true
    loggerId: apimLogger.id
    metrics: true
    verbosity: 'verbose'
    sampling: {
      samplingType: 'fixed'
      percentage: 100
    }
    frontend: {
      request: logSettings
      response: logSettings
    }
    backend: {
      request: logSettings
      response: logSettings
    }
  }
}
