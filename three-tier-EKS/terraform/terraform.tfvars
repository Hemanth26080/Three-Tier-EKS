# terraform/terraform.tfvars
location                    = "northeurope"
resource_group_name         = "three-tier-rg"
vnet_name                   = "three-tier-vnet"
vnet_address_space          = ["10.0.0.0/16"]
aks_subnet_name             = "aks-nodes-subnet"
aks_subnet_address_prefixes = ["10.0.0.0/22"]
ingress_subnet_name         = "aks-ingress-subnet"
ingress_subnet_address_prefixes = ["10.0.4.0/24"]
cluster_name                = "three-tier-aks"
dns_prefix                  = "threetieraks"
system_node_count           = 2
system_node_min_count       = 1
system_node_max_count       = 3
vm_size                     = "Standard_DC2as_v6"
acr_name                    = "threetieracr123"
acr_sku                     = "Standard"
tags = {
  Environment = "production"
  Project     = "three-tier-architecture"
  ManagedBy   = "Terraform"
}
