package constructs

import (
	"github.com/aws/aws-cdk-go/awscdk/v2/awss3"
	"github.com/aws/constructs-go/constructs/v10"
	"github.com/aws/jsii-runtime-go"
)

func NewDocumentBucket(scope constructs.Construct, id string) awss3.Bucket {
	bucket := awss3.NewBucket(scope, jsii.String(id), &awss3.BucketProps{
		BucketName:        jsii.String("document-upload-service-bucket"),
		Versioned:         jsii.Bool(true),
		BlockPublicAccess: awss3.BlockPublicAccess_BLOCK_ALL(),
		AutoDeleteObjects: jsii.Bool(true),
		Cors: &[]*awss3.CorsRule{
			{
				AllowedMethods: &[]awss3.HttpMethods{
					awss3.HttpMethods_PUT,
					awss3.HttpMethods_POST,
					awss3.HttpMethods_GET,
				},
				AllowedOrigins: &[]*string{
					jsii.String("*"),
				},
				AllowedHeaders: &[]*string{
					jsii.String("*"),
				},
			},
		},
	})
	return bucket
}
