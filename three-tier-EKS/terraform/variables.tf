variable "location" {
  description = "The Azure region where resources will be deployed"
  type        = string
  default     = "northeurope"
}

variable "resource_group_name" {
  description = "The name of the resource group"
  type        = string
  default     = "three-tier-rg"
}

variable "vnet_name" {
  description = "Name of the Virtual Network"
  type        = string
  default     = "aks-vnet"
}

variable "vnet_address_space" {
  description = "Address space for the Virtual Network"
  type        = list(string)
  default     = ["10.0.0.0/16"]
}

variable "aks_subnet_name" {
  description = "Name of the subnet dedicated to AKS"
  type        = string
  default     = "aks-subnet"
}

variable "aks_subnet_address_prefixes" {
  description = "Address prefixes for the AKS subnet"
  type        = list(string)
  default     = ["10.0.1.0/24"]
}

variable "cluster_name" {
  description = "The name of the AKS cluster"
  type        = string
  default     = "three-tier-aks"
}

variable "dns_prefix" {
  description = "DNS prefix for the AKS cluster"
  type        = string
  default     = "threetieraks"
}

variable "node_count" {
  description = "Initial number of nodes in the default node pool"
  type        = number
  default     = 2
}

variable "vm_size" {
  description = "VM size for AKS worker nodes"
  type        = string
  default     = "Standard_B2s"
}

variable "acr_name" {
  description = "Name of the Azure Container Registry (must be alphanumeric and globally unique)"
  type        = string
  default     = "threetieracr123"
}

variable "acr_sku" {
  description = "SKU for Azure Container Registry"
  type        = string
  default     = "Standard"
}

