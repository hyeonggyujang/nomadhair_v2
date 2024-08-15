set -e

echo ====================BUILD========================
npm run build
echo ===================CDK LIST======================
echo The following stack is being deployed:
cdk list --profile nomadhair 
echo ===================CDK Bootstrap=================
cdk bootstrap --profile nomadhair
echo ===================CDK DEPLOY==================== 
cdk deploy --all --profile nomadhair