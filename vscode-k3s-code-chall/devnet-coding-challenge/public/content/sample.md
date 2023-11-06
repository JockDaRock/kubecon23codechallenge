# Kubernetes Deployment

The Panoptica controller is deployed as a single pod in any Kubernetes cluster, including managed environments such as OpenShift and GKE. From there, it can apply Panoptica workload management methods on the entire cluster.

To connect your Kubernetes cluster to Panoptica, first register it in the Panoptica platform, then deploy our controller in your cluster using Helm charts. Once the controller is deployed, you will gain all the benefits of Panoptica security protection: visibility, inventory scanning, attack path analysis, etc. Panoptica enables implicit, automatic scalability as you grow the cluster to production scales.

## Prerequisites for the cluster

- Kubernetes 1.23 or later
- Helm version 3.8.0 or higher, with OCI registry support
- At least three nodes in the cluster
- K8s CLI (kubectl) should be installed on the machine or VM from which the deployment is run, with admin permissions to the cluster
- DNS resolution and external access to these domains, on port 443:
  - Panoptica platform: appsecurity.cisco.com (34.74.85.197)
  - GCP Container Registry (if not using internal registry): gcr.io/etcioud/k8sec
- Resources: 5 GB memory, 1.2 vCPU cores (total, for all nodes).

## Register the Controller

To start securing your Kubernetes resources, log into Panoptica, register your cluster in the platform, and receive customized Helm chart commands to deploy our controller in your cluster.

1. Go to **Settings** in the navigation pane, then the **Accounts** tab. Choose **Kubernetes**.
2. Enter a unique name for your Kubernetes cluster, as you want it to appear in Panoptica.
3. Click **Register** to define the cluster name in Panoptica. Once registered, Panoptica will generate an access key for your cluster, and the Helm commands will become visible.

## Install the Controller

1. Copy the Helm chart commands, which you'll use to install the controller in your cluster. For convenience, you can click the **Copy** button in the corner of the text window.
2. Go to your machine or VM and run the Helm chart installation commands to install the controller on your cluster. Note that the installer requires admin permissions to the cluster to deploy the controller.
3. The cluster will now appear in the table on the Accounts page. Once Panoptica's controller has been deployed in your cluster, the Status will change to **Connected**.

To manage your clusters:

- Click the three dots (⋮) at the end of each line to open a drop-down list of actions you can perform on that cluster:
  - To initiate an immediate scan, select **Scan Now**.
  - To change the name of the cluster, select **Edit**.
  - To ignore a cluster, without deleting it, select **Exclude**. This is useful for temporarily halting scans without offboarding the cluster, and for excluding certain auto-generated accounts from an organization, such as HR.
  - To remove the controller from Panoptica, select **Delete**.

> Updated about 2 months ago
