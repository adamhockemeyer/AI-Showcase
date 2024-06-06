provider "azurerm" {  
  features {}  
}  
  
resource "azurerm_resource_group" "openai" {  
  name     = "${local.prefix}-ai-showcase-rg"  
  location = "eastus2"  
}  
  
locals { 
  # All variables used in this profject should be 
  # added as locals here 
  resource_group          = azurerm_resource_group.openai.name
  prefix                  = var.prefix
  location                = "eastus2"
  common_tags = { 
    created_by = "Terraform" 
  }
}