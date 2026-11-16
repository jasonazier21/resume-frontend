#Requires -Version 5.1
<#
.SYNOPSIS
  Syncs the static resume site to an S3 bucket and optionally invalidates CloudFront.

.EXAMPLE
  .\deploy.ps1 -Bucket my-resume-bucket
  .\deploy.ps1 -Bucket my-resume-bucket -DistributionId E123ABC456DEF
#>
param(
  [Parameter(Mandatory = $true)]
  [string]$Bucket,

  [string]$DistributionId
)

$ErrorActionPreference = 'Stop'
Set-Location -Path $PSScriptRoot

function Assert-LastExit([string]$what) {
  if ($LASTEXITCODE -ne 0) {
    Write-Host "FAILED: $what (exit code $LASTEXITCODE)" -ForegroundColor Red
    exit $LASTEXITCODE
  }
}

Write-Host "Syncing site to s3://$Bucket ..." -ForegroundColor Cyan
aws s3 sync . "s3://$Bucket" --profile dev `
  --exclude ".git/*" --exclude "*.ps1" --exclude ".gitignore" --exclude "README.md" `
  --delete
Assert-LastExit "S3 sync"
Write-Host "SUCCESS: files synced to s3://$Bucket" -ForegroundColor Green

if ($DistributionId) {
  Write-Host "Creating CloudFront invalidation for $DistributionId ..." -ForegroundColor Cyan
  aws cloudfront create-invalidation --distribution-id $DistributionId --paths "/*" --profile dev
  Assert-LastExit "CloudFront invalidation"
  Write-Host "SUCCESS: invalidation created for $DistributionId" -ForegroundColor Green
} else {
  Write-Host "No -DistributionId given; skipping CloudFront invalidation." -ForegroundColor Yellow
}

Write-Host "Deploy complete." -ForegroundColor Green
