variable "lambda_execution_role_arn" {
  description = "ARN of the IAM role to be used by the Lambda function"
  type        = string
}

variable "api_calls_app_execution_arn" {
  description = "api gateway's execution arn"
  type        = string
}


variable "database_url" {
  description = "data base url"
  type       = string
}

# create schedule lambda
resource "aws_lambda_function" "create_schedule_lambda" {
  function_name = "createSchedule"
  runtime       = "nodejs20.x"
  handler       = "createSchedule.handler"
  role          = var.lambda_execution_role_arn
  filename      = "${path.module}/../../lambda/dist/src/createSchedule.zip"

  environment {
    variables = {
      DATABASE_URL = var.database_url
    }
  }
}

resource "aws_lambda_permission" "allow_apigateway_invoke_create_schedule" {
  statement_id  = "AllowExecutionFromAPIGatewayCreateSchedule"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_schedule_lambda.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.api_calls_app_execution_arn}/*"
}

output "create_schedule_lambda_arn" {
  description = "arn of create_schedule lambda"
  value       = aws_lambda_function.create_schedule_lambda.arn
}

# delete schedule lambda
resource "aws_lambda_function" "delete_schedule_lambda" {
  function_name = "deleteSchedule"
  runtime       = "nodejs20.x"
  handler       = "createSchedule.handler"
  role          = var.lambda_execution_role_arn
  filename      = "${path.module}/../../lambda/dist/src/createSchedule.zip"

  environment {
    variables = {
      DATABASE_URL = var.database_url
    }
  }
}

resource "aws_lambda_permission" "allow_apigateway_invoke_delete_schedule" {
  statement_id  = "AllowExecutionFromAPIGatewayDeleteSchedule"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.delete_schedule_lambda.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.api_calls_app_execution_arn}/*"
}

output "delete_schedule_lambda_arn" {
  description = "arn of current delete_schedule_lambda lambda"
  value       = aws_lambda_function.delete_schedule_lambda.arn
}

# create get schedules lambda
resource "aws_lambda_function" "get_schedules_lambda" {
  function_name = "getSchedules"
  runtime       = "nodejs20.x"
  handler       = "getSchedules.handler"
  role          = var.lambda_execution_role_arn
  filename      = "${path.module}/../../lambda/dist/src/getSchedules.zip"

  environment {
    variables = {
      DATABASE_URL = var.database_url
    }
  }
}

resource "aws_lambda_permission" "allow_apigateway_invoke_get_schedules" {
  statement_id  = "AllowExecutionFromAPIGatewayGetSchedules"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_schedules_lambda.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.api_calls_app_execution_arn}/*"
}

output "get_schedules_lambda_arn" {
  description = "arn of get schedules lambda"
  value       = aws_lambda_function.get_schedules_lambda.arn
}
