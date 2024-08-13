echo ===================CDK LIST====================== 
echo The follosing stack is being deployed:
cdk list
echo ===================CDK Bootstrap=================
cdk bootstrap --profile nomadhair
echo ===================CDK DEPLOY===================== 
cdk deploy --all --profile nomadhair