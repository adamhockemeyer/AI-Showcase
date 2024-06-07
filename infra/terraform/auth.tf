resource "azurerm_role_assignment" "cognitive_services_user_assignment" {
  scope                             = azurerm_cognitive_account.ca.id
  role_definition_name              = "Cognitive Services OpenAI User"
  principal_id                      = "${lookup(azurerm_static_web_app.static-web-app.identity[0],"principal_id")}"
  skip_service_principal_aad_check  = true
}