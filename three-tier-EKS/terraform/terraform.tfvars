location                    = "northeurope"
resource_group_name         = "three-tier-rg"
vnet_name                   = "aks-vnet"
vnet_address_space          = ["10.0.0.0/16"]
aks_subnet_name             = "aks-subnet"
aks_subnet_address_prefixes = ["10.0.1.0/24"]
cluster_name                = "three-tier-aks"
dns_prefix                  = "threetieraks"
node_count                  = 2
vm_size                     = "Standard_B2s"
acr_name                    = "threetieracr123"
acr_sku                     = "Standard"

