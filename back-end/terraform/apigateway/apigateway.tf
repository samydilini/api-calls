resource "aws_apigatewayv2_api" "api_calls_app" {
  name          = "ApiCallsApp"
  protocol_type = "HTTP"
}

variable "create_schedule_lambda_arn" {
  description = "ARN of the create schedule lambda function"
  type        = string
}

resource "aws_apigatewayv2_integration" "create_schedule_lambda_integration" {
  api_id           = aws_apigatewayv2_api.api_calls_app.id
  integration_type = "AWS_PROXY"
  integration_uri  = var.create_schedule_lambda_arn
}

resource "aws_apigatewayv2_route" "create_schedule_lambda_route" {
  api_id    = aws_apigatewayv2_api.api_calls_app.id
  route_key = "POST /create/schedule"
  target    = "integrations/${aws_apigatewayv2_integration.create_schedule_lambda_integration.id}"
}

variable "delete_schedule_lambda_arn" {
  description = "ARN of the delete schedule lambda_arn function"
  type        = string
}

resource "aws_apigatewayv2_integration" "delete_schedule_lambda_integration" {
  api_id           = aws_apigatewayv2_api.api_calls_app.id
  integration_type = "AWS_PROXY"
  integration_uri  = var.delete_schedule_lambda_arn
}

#use a proper delete
resource "aws_apigatewayv2_route" "delete_schedule_lambda_route" {
  api_id    = aws_apigatewayv2_api.api_calls_app.id
  route_key = "POST /delete/schedule"
  target    = "integrations/${aws_apigatewayv2_integration.delete_schedule_lambda_integration.id}"
}

variable "get_schedules_lambda_arn" {
  description = "ARN of the get schedules lambda function"
  type        = string
}

resource "aws_apigatewayv2_integration" "get_schedules_lambda_integration" {
  api_id           = aws_apigatewayv2_api.api_calls_app.id
  integration_type = "AWS_PROXY"
  integration_uri  = var.get_schedules_lambda_arn
}

resource "aws_apigatewayv2_route" "get_schedules_lambda_route" {
  api_id    = aws_apigatewayv2_api.api_calls_app.id
  route_key = "GET /schedules"
  target    = "integrations/${aws_apigatewayv2_integration.get_schedules_lambda_integration.id}"
}


output "api_gateway_url" {
  description = "The URL of the API Gateway"
  value       = aws_apigatewayv2_api.api_calls_app.api_endpoint
}

output "api_calls_app_execution_arn" {
  value = aws_apigatewayv2_api.api_calls_app.execution_arn
}

resource "aws_apigatewayv2_stage" "prod_stage" {
  api_id      = aws_apigatewayv2_api.api_calls_app.id
  name        = "prod"
  auto_deploy = true
}