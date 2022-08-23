import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Code, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path'

export class CdkStarterStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const calcLayer = new LayerVersion(this, 'calc-layer', {
      compatibleRuntimes: [Runtime.NODEJS_14_X],
      code: Code.fromAsset('src/layers/calc'),
      description: 'multiplies a number by 2'
    })

    const yupLayer = new LayerVersion(this, 'yup-layer', {
      compatibleRuntimes: [Runtime.NODEJS_14_X],
      code: Code.fromAsset('src/layers/yup-utils'),
      description: 'use a 3rd party library'
    })

    new NodejsFunction(this, 'func-with-layer', {
      memorySize: 1024,
      timeout: Duration.seconds(5),
      runtime: Runtime.NODEJS_14_X,
      entry: path.join(__dirname, 'src/lambda-with-layer/index.ts'),
      bundling: {
        minify: false,
        externalModules: ['aws-sdk', 'yup'],
      },
      layers: [calcLayer, yupLayer],
    })
  }
}
