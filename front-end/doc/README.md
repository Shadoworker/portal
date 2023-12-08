# Build a staging container

Open a terminal in the `kayfo-app` folder.

## Get credentials to the ECR repository

`aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 783700776172.dkr.ecr.eu-central-1.amazonaws.com`


## Build and push to ECR Without BuildX

`docker build -t 783700776172.dkr.ecr.eu-central-1.amazonaws.com/kayfo-app-staging:latest --push --platform=linux/arm64 -f Dockerfile .`

## Build and push to ECR (buildX)

`docker buildx build -t 783700776172.dkr.ecr.eu-central-1.amazonaws.com/kayfo-app-staging:latest --push --platform=linux/amd64,linux/arm64 -f Dockerfile .`

⚠️ As the build can be quit long, the credentials obtained in the first step may have expired at the end of the operation. Run both command again and you should be fine.
As the build will be cached, it should be fast.

## Deploy the new container on Elastic Beanstalk

In the [Elastic Beanstalk console](https://eu-central-1.console.aws.amazon.com/elasticbeanstalk/home?region=eu-central-1#/application/versions?applicationName=kayfo-app-staging)
select the `kayfo-app-staging-latest` application version and deploy it to the `kayfo-app-staging` environment.


# Working with Terraform

Open a terminal in the `infra` directory.

Before you can work, you must run `terraform init`

## Workspaces

To list the available workspaces, run:

`terraform workspace list`

To change the current workspace, run:

`terraform workspace select <workspace_name>`

## Update infrastructure

Let's add a new environment variable to our Elastic Beanstalk deployment.

Open the `beanstalk.tf` file and add the following at the end:

```
{
  name = "TOTO",
  value = "TATA"
},
```

Run `terraform apply`

Review the plan to make sure that only the intended modification will be executed.

Approve the plan, wait ... You should be able to see the new variable in the Elastic Beanstalk console

# Connect to instances and database

## Connect to instances

Go to the [AWS Session Manager Console](https://eu-central-1.console.aws.amazon.com/systems-manager/session-manager/sessions?region=eu-central-1)

Click the `Start Session` button and select the instance you want to log to.

Once connected to the instance, run `sudo su`

### Connect to the container

Once you have a sudo session on the instance, get the name of the running container:

`docker ps`

Then connect to the container by running:

`docker exec -it <container_name> sh`

## Connect to the database

### Deploy the bastion in the VPC

Go to the [Terraform Cloud Workspace](https://app.terraform.io/app/kayfo-games/workspaces/kayfo-app-staging/variables) containing your resources
and modify the `bastion` variable to `true`.

Run `terraform apply` for that workspace.

### Connect your local environment to the bastion

In your terminal run: `aws ssm start-session --region eu-central-1 --target <bastion_id> --document-name AWS-StartPortForwardingSession --parameters '{"portNumber":["3306"],"localPortNumber":["3306"]}'`

From now on, every request you send to `localhost:3306` is forwarded to the RDS database.

You can configure any database client with the host `localhost`.

# Tools

## Terraform

### Install Terraform CLI

https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli

## Terraform Cloud (TFC)

Create an account on https://app.terraform.io/ and make sure it is a member of the `kayfo-games` organization.

To connect your local environment with TFC, run the `terraform login` command and follow instructions.

## AWS CLI

### Install AWS CLI

https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

### Configure AWS CLI

In order to configure the AWS CLI you need an IAM Access Key.
You can generate a new one in the [IAM console](https://us-east-1.console.aws.amazon.com/iamv2/home#/security_credentials?section=IAM_credentials)

Then follow instruction on https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html

## Docker

### Install Docker

https://docs.docker.com/get-docker/

### Install buildx

https://docs.docker.com/build/install-buildx/
