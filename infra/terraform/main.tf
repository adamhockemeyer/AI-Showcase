provider "azurerm" {  
  features {}  
}  
  
resource "azurerm_resource_group" "openai" {  
  name     = "ai-showcase-rg"  
  location = "eastus2"  
}  
  
resource "azurerm_cognitive_account" "ca" {
  name                = "cognitive-account"
  location            = azurerm_resource_group.openai.location
  resource_group_name = azurerm_resource_group.openai.name
  kind                = "OpenAI"
  sku_name            = "S0"
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
