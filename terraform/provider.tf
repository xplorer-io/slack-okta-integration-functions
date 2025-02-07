terraform {
  required_providers {
    google = {
      version = ">= 6.18.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}
