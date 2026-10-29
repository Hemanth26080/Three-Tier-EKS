# terraform/variables.tf
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
  default     = "three-tier-vnet"
}

variable "vnet_address_space" {
  description = "Address space for the Virtual Network"
  type        = list(string)
  default     = ["10.0.0.0/16"]
}

variable "aks_subnet_name" {
  description = "Name of the subnet dedicated to AKS nodes and pods"
  type        = string
  default     = "aks-nodes-subnet"
}

variable "aks_subnet_address_prefixes" {
  description = "Address prefixes for the AKS subnet (size /22 provides 1022 IPs for Azure CNI)"
  type        = list(string)
  default     = ["10.0.0.0/22"]
}

variable "ingress_subnet_name" {
  description = "Name of the subnet dedicated to Ingress / Application Gateway / Load Balancer"
  type        = string
  default     = "aks-ingress-subnet"
}

variable "ingress_subnet_address_prefixes" {
  description = "Address prefixes for the Ingress subnet"
  type        = list(string)
  default     = ["10.0.4.0/24"]
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

variable "kubernetes_version" {
  description = "Kubernetes version for AKS"
  type        = string
  default     = null
}

variable "system_node_count" {
  description = "Initial number of nodes in the system node pool"
  type        = number
  default     = 2
}

variable "system_node_min_count" {
  description = "Minimum nodes in the system node pool"
  type        = number
  default     = 1
}

variable "system_node_max_count" {
  description = "Maximum nodes in the system node pool"
  type        = number
  default     = 3
}

variable "vm_size" {
  description = "VM size for AKS worker nodes"
  type        = string
  default     = "Standard_DC2as_v6"
}

variable "acr_name" {
  description = "Globally unique name of the Azure Container Registry"
  type        = string
  default     = "threetieracr123"
}

variable "acr_sku" {
  description = "SKU for Azure Container Registry"
  type        = string
  default     = "Standard"
}

variable "tags" {
  description = "Tags applied to all Azure resources"
  type        = map(string)
  default = {
    Environment = "production"
    Project     = "three-tier-architecture"
    ManagedBy   = "Terraform"
  }
}
