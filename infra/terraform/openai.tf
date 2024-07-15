resource "azurerm_cognitive_account" "ca" {
  name                = "${local.prefix}-cognitive-account"
  location            = local.location
  resource_group_name = local.resource_group 
  kind                = "OpenAI"
  sku_name            = "S0"
  tags                = local.common_tags
}

resource "azurerm_cognitive_deployment" "gpt35" {
  name                  = "gpt-35-turbo"
  cognitive_account_id  = azurerm_cognitive_account.ca.id
  model {
    format              = "OpenAI"
    name                = "gpt-35-turbo"
    version             = "0613"
  }

  scale {
    type = "Standard"
  }
}

resource "azurerm_cognitive_deployment" "gpt4" {
  name                  = "gpt-4o"
  cognitive_account_id  = azurerm_cognitive_account.ca.id
  model {
    format              = "OpenAI"
    name                = "gpt-4o"
    version             = "2024-05-13"
  }

  scale {
    type = "Standard"
  }
}

resource "azurerm_cognitive_deployment" "text-large" {
  name                  = "text-embedding-large"
  cognitive_account_id  = azurerm_cognitive_account.ca.id
  model {
    format              = "OpenAI"
    name                = "text-embedding-3-large"
    version             = "1"
  }

  scale {
    type = "Standard"
  }
}

resource "azurerm_cognitive_deployment" "text-small" {
  name                  = "text-embedding-small"
  cognitive_account_id  = azurerm_cognitive_account.ca.id
  model {
    format              = "OpenAI"
    name                = "text-embedding-3-small"
    version             = "1"
  }

  scale {
    type = "Standard"
  }
}

resource "azurerm_monitor_diagnostic_setting" "settings" {
  name                       = "DiagnosticsSettings"
  target_resource_id         = azurerm_cognitive_account.ca.id
  log_analytics_workspace_id = local.la_workspace_id 

  enabled_log {
    category = "Audit"
  }

  enabled_log {
    category = "RequestResponse"
  }

  enabled_log {
    category = "Trace"
  }

  metric {
    category = "AllMetrics"
  }
}