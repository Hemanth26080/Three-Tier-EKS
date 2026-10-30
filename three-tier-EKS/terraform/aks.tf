# terraform/aks.tf
resource "azurerm_kubernetes_cluster" "aks" {
  name                = var.cluster_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = var.dns_prefix
  kubernetes_version  = var.kubernetes_version
  tags                = var.tags

  # Production Default System Node Pool with Autoscaling
  default_node_pool {
    name                = "systemnodes"
    node_count          = var.system_node_count
    vm_size             = var.vm_size
    vnet_subnet_id      = azurerm_subnet.aks_subnet.id
    enable_auto_scaling = true
    min_count           = var.system_node_min_count
    max_count           = var.system_node_max_count
    os_disk_size_gb     = 50
    os_disk_type        = "Managed"
    type                = "VirtualMachineScaleSets"
    tags                = var.tags
  }

  # Azure Managed Identity
  identity {
    type = "SystemAssigned"
  }

  # Network Profile using Azure CNI & Standard Load Balancer
  network_profile {
    network_plugin    = "azure"
    load_balancer_sku = "standard"
    outbound_type     = "loadBalancer"
    service_cidr      = var.service_cidr
    dns_service_ip    = var.dns_service_ip
  }

  # Production Storage Profile (Enables Azure Disk & Azure File CSI drivers for MongoDB)
  storage_profile {
    disk_driver_enabled = true
    file_driver_enabled = true
  }

  lifecycle {
    ignore_changes = [
      default_node_pool[0].node_count
    ]
  }
}

# Attach ACR to AKS so kubelet can pull container images without static credentials
resource "azurerm_role_assignment" "aks_acr_pull" {
  principal_id                     = azurerm_kubernetes_cluster.aks.kubelet_identity[0].object_id
  role_definition_name             = "AcrPull"
  scope                            = azurerm_container_registry.acr.id
  skip_service_principal_aad_check = true
}
