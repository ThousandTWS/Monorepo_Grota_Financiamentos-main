package main

import (
	stacks "aws/Stacks"

	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/jsii-runtime-go"
)

func main() {
	jsii.Close()

	app := awscdk.NewApp(nil)

	stacks.NewS3UploadStack(app, "S3UploadServiceStack", &stacks.S3UploadStackProps{
		StackProps: awscdk.StackProps{
			Env: env(),
		},
	})
	app.Synth(nil)
}

func env() *awscdk.Environment {
	return &awscdk.Environment{
		Account: jsii.String("011547836055"),
		Region:  jsii.String("us-east-1"),
	}
}
