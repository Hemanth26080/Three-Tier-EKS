# Three-Tier Web Application on Azure Kubernetes Service (AKS)

A complete end-to-end DevOps demonstration of deploying an enterprise-grade three-tier web application using Infrastructure as Code (Terraform), containerization (Docker), container orchestration (Kubernetes / Azure AKS), GitOps/Helm workflows, and full-stack observability (Prometheus & Grafana).

---

## 🏛 Architecture Overview

```
                      +-----------------------------+
                      |          End User           |
                      +--------------+--------------+
                                     |
                                     | (HTTPS / HTTP)
                                     v
                      +-----------------------------+
                      |   Ingress Controller        |
                      |        (NGINX)              |
                      +-------+-------------+-------+
                              |             |
           Path: / (Frontend) |             | Path: /api (Backend)
                              v             v
             +--------------------+     +--------------------+
             |   React Frontend   |     |   Node.js Backend  |
             |       (Pods)       |     |       (Pods)       |
             +--------------------+     +---------+----------+
                                                  |
                                                  | Mongoose / DB Wire
                                                  v
                                        +--------------------+
                                        |  MongoDB Database  |
                                        | (StatefulSet / PV) |
                                        +--------------------+
```

### Request Lifecycle
1. **Public Ingestion**: Users access the public IP/FQDN handled by Azure Load Balancer and routed via **Ingress-NGINX**.
2. **Path Routing**: Ingress intelligently routes traffic:
   - `/` $\rightarrow$ React Single Page Application (SPA).
   - `/api` $\rightarrow$ Node.js REST API service.
3. **Data Persistence**: The backend connects to the internal MongoDB instance configured with Kubernetes Persistent Volumes (PV/PVC).
4. **Self-Healing & Scalability**: Kubernetes ReplicaSets ensure auto-recovery of failed pods and support Horizontal Pod Autoscaling (HPA).

---

## 🧰 Tools & Technologies

| Tool | Purpose |
| :--- | :--- |
| **Azure AKS** | Managed Kubernetes cluster managing container lifecycle, scaling, and recovery |
| **Terraform** | Declarative Infrastructure as Code (IaC) provisioning all Azure resources |
| **Docker** | Multi-stage container builds packaging React frontend and Node.js backend |
| **Azure ACR** | Private container registry securing and storing Docker images |
| **kubectl** | CLI for managing and inspecting Kubernetes manifests and workloads |
| **Helm** | Kubernetes package manager for installing Ingress-NGINX and Prometheus stack |
| **Prometheus + Grafana** | Metrics collection, threshold alerting, and interactive telemetry dashboards |

---

## 📁 Repository Structure

```
.
├── src/
│   ├── frontend/             # React SPA (source, public assets, Dockerfile)
│   └── backend/              # Node.js Express API (server.js, Dockerfile)
│
├── terraform/                # Infrastructure as Code (Azure)
│   ├── main.tf               # Terraform settings, providers, and remote backend
│   ├── network.tf            # Resource Group, VNet, Subnet
│   ├── aks.tf                # AKS cluster and ACR role assignment
│   ├── acr.tf                # Azure Container Registry
│   ├── variables.tf          # Input variables & defaults
│   ├── outputs.tf            # Cluster credentials & registry endpoints
│   └── terraform.tfvars      # Environment-specific configuration
│
├── k8s/                      # Kubernetes Manifests
│   ├── namespaces/           # Isolated environments (dev/prod)
│   ├── secrets/              # Credentials and configuration maps
│   ├── mongodb/              # MongoDB StatefulSet/Deployment & PersistentVolume
│   ├── backend/              # Node.js backend Deployment & Service
│   ├── frontend/             # React frontend Deployment & Service
│   └── ingress/              # Ingress rules routing traffic
│
└── monitoring/               # Observability Configuration
    ├── prometheus-values.yaml# Custom values for Prometheus/Grafana Helm chart
    └── grafana-dashboards/   # Preconfigured application dashboards
```

---

## 🚀 Step-by-Step Deployment Guide

### Prerequisites
- [Azure CLI (`az`)](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) logged in (`az login`)
- [Terraform](https://developer.hashicorp.com/terraform/downloads) ($\ge$ 1.5.0)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Helm 3](https://helm.sh/docs/intro/install/)

---

### Step 1: Provision Infrastructure with Terraform

1. Navigate to the terraform directory:
   ```bash
   cd terraform
   ```
2. Initialize and validate the Terraform configuration:
   ```bash
   terraform init
   terraform validate
   ```
3. Plan and apply the deployment:
   ```bash
   terraform plan -out=tfplan
   terraform apply tfplan
   ```
4. Authenticate `kubectl` to your new AKS cluster:
   ```bash
   az aks get-credentials --resource-group three-tier-rg --name three-tier-aks --overwrite-existing
   ```

---

### Step 2: Build & Push Container Images to ACR

1. Log in to your Azure Container Registry:
   ```bash
   az acr login --name <your-acr-name>
   ```

2. Build and push the **Backend** image:
   ```bash
   docker build -t <your-acr-name>.azurecr.io/backend:v1 ./src/backend
   docker push <your-acr-name>.azurecr.io/backend:v1
   ```

3. Build and push the **Frontend** image:
   ```bash
   docker build -t <your-acr-name>.azurecr.io/frontend:v1 ./src/frontend
   docker push <your-acr-name>.azurecr.io/frontend:v1
   ```

---

### Step 3: Deploy Application onto Kubernetes

1. Apply namespace and secrets:
   ```bash
   kubectl apply -f k8s/namespaces/
   kubectl apply -f k8s/secrets/
   ```

2. Deploy the database layer (MongoDB):
   ```bash
   kubectl apply -f k8s/mongodb/
   ```

3. Deploy backend and frontend workloads:
   ```bash
   kubectl apply -f k8s/backend/
   kubectl apply -f k8s/frontend/
   ```

4. Install Ingress-NGINX controller via Helm:
   ```bash
   helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
   helm repo update
   helm install ingress-nginx ingress-nginx/ingress-nginx
   ```

5. Apply Ingress routing:
   ```bash
   kubectl apply -f k8s/ingress/
   ```

---

### Step 4: Deploy Monitoring Stack (Prometheus + Grafana)

1. Add Prometheus community Helm repository:
   ```bash
   helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
   helm repo update
   ```

2. Install kube-prometheus-stack using custom values:
   ```bash
   helm install monitoring prometheus-community/kube-prometheus-stack \
     -f monitoring/prometheus-values.yaml \
     --namespace monitoring \
     --create-namespace
   ```

3. Access the Grafana dashboard:
   ```bash
   kubectl port-forward svc/monitoring-grafana 3000:80 -n monitoring
   ```
   Open `http://localhost:3000` in your browser (Default user: `admin`, password retrieved via secret).

---

## 🔒 Security & Best Practices
- **Role-Based Access Control (RBAC)**: Managed AKS cluster integrated with Azure Entra ID / Managed Identity.
- **ACR Integration**: Dedicated `AcrPull` role assignment configured via Terraform without embedding static credentials.
- **Non-Root Containers**: Frontend and backend containers run under unprivileged user contexts.
- **Resource Limits**: Pods configured with memory and CPU `requests` and `limits` to prevent node exhaustion.
- **Remote State**: Terraform state management backed by Azure Blob Storage with locking support.

