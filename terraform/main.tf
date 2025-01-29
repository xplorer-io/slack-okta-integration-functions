data "archive_file" "okta_integration_artifact" {
  type        = "zip"
  source_dir  = "../dist"
  output_path = "bundle.zip"
}

resource "google_storage_bucket_object" "okta_integration_artifact" {
  source       = data.archive_file.okta_integration_artifact.output_path
  content_type = "application/zip"
  name   = "src-${data.archive_file.okta_integration_artifact.output_md5}.zip"
  bucket = var.artifacts_bucket_name
}

resource "google_cloudfunctions2_function" "okta_integration_function" {
  name = "slack-okta-integration"
  location = var.region
  description = "This function runs daily and syncs users between Xplorers Slack and Okta Identity Provider"

  build_config {
    runtime = "nodejs22"
    entry_point = "slackEventHandler"
    source {
      storage_source {
        bucket = var.artifacts_bucket_name
        object = google_storage_bucket_object.okta_integration_artifact.name
      }
    }
  }

  service_config {
    max_instance_count  = 1
    available_memory    = "256M"
    timeout_seconds     = 30
  }
}
