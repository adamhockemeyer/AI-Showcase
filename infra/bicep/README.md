
``` bash
# Build the bicep file
az bicep build -f main.bicep
```

``` bash
# Create a resource group if it doesn't exist
az group create --name <resource-group-name> --location <location> --tags <tags>
```

``` bash
# Deploy the bicep file to Azure
az deployment group create --resource-group <resource-group-name> --template-file main.bicep
```
