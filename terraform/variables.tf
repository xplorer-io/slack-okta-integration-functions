variable "project_id" {
  type = string
}

variable "project_number" {
  type = string
}

variable "region" {
  type = string
}

variable "artifacts_bucket_name" {
  type        = string
  description = "Bucket storing okta integration artifacts"
}
