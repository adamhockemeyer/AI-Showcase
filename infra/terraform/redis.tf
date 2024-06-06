resource "azurerm_redis_cache" "redis" {
  name                = "${local.prefix}-redis"
  location            = local.location
  resource_group_name = local.resource_group 
  capacity            = 2
  family              = "C"
  sku_name            = "Standard"
  enable_non_ssl_port = true
  minimum_tls_version = "1.2"

  redis_configuration {
    notify_keyspace_events = "Egx"
  }
}