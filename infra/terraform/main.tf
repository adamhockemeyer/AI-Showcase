provider "azurerm" {  
  features {}  
}  
  
resource "azurerm_resource_group" "openai" {  
  name     = "${local.prefix}-ai-showcase-rg"  
  location = "eastus2"  
  tags     = local.common_tags
}  
  
locals { 
  # All variables used in this profject should be 
  # added as locals here 
  resource_group          = azurerm_resource_group.openai.name
  prefix                  = var.prefix
  location                = "eastus2"
  la_workspace_id         = azurerm_log_analytics_workspace.log_analytics_workspace.id
  common_tags = { 
    created_by = "Terraform",
    project    = "AI Showcase"
  }
}

resource "azurerm_log_analytics_workspace" "log_analytics_workspace" {
  name                = "${local.prefix}-log-analytics-workspace"
  location            = local.location
  resource_group_name = local.resource_group
  tags                = local.common_tags
}