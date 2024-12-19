output "api_gateway_url" {
  description = "The URL of the API Gateway"
  value       = module.apigateway.api_gateway_url
}

output "database_host" {
  description = "data base url"
  value       = module.rds.database_host
}
