variable "failover_location" {
  type = string
  default = "centralus"
  description = "Failover region"
}

resource "azurerm_cosmosdb_account" "db" {
  name                = "${local.prefix}-cosmos-db"
  location            = local.location 
  resource_group_name = local.resource_group 
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  automatic_failover_enabled = true

  capabilities {
    name = "EnableAggregationPipeline"
  }

  capabilities {
    name = "mongoEnableDocLevelTTL"
  }

  capabilities {
    name = "MongoDBv3.4"
  }

  consistency_policy {
    consistency_level       = "Eventual"
    max_interval_in_seconds = 10
    max_staleness_prefix    = 200
  }

  geo_location {
    location          = var.failover_location
    failover_priority = 1
  }

  geo_location {
    location          = local.location
    failover_priority = 0
  }
}

resource "azurerm_advanced_threat_protection" "aatp" {
  target_resource_id  = azurerm_cosmosdb_account.db.id
  enabled             = true
}
