# Create AppService Plan
resource "azurerm_service_plan" "appserviceplan" {
  name                = "${local.prefix}-appserviceplan"
  location            = local.location 
  resource_group_name = local.resource_group 
  os_type             = "Linux"
  sku_name            = "P1v2"
}

# Create a WebApp in the Appservice plan
# Use the todo image we created in the ACR using MI
resource "azurerm_linux_web_app" "webapp" {
  name                = "${local.prefix}-webapp"
  location            = local.location
  resource_group_name = local.resource_group 
  service_plan_id     = azurerm_service_plan.appserviceplan.id
  https_only          = true

  site_config {

  }

  logs {
    application_logs {
      file_system_level   = "Information"
    }
    http_logs {
      file_system {
        retention_in_days = 2
        retention_in_mb   = 50
      }
    }
  }  
  app_settings = {
  
  }

  identity {
    type                = "SystemAssigned"
  }
}