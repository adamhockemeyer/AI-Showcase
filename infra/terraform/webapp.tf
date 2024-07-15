# Create Azure Static Web App

resource "azurerm_static_web_app" "static-web-app" {
  name                = "${local.prefix}-static-web-app"
  resource_group_name = local.resource_group
  location            = local.location
  sku_tier            = "Standard"
  sku_size            = "Standard"
  identity {
    type = "SystemAssigned"
  }
  tags = local.common_tags
}