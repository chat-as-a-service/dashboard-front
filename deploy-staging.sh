#!/bin/bash

# Set the name of your bucket
BUCKET_NAME="staging-wingflo-dashboard-front"

# Step 1: Delete all files in the bucket
gsutil -m rm gs://$BUCKET_NAME/**

# Step 2: Upload all files except index.html and build/static
gsutil -m cp -r $(find build -mindepth 1 -maxdepth 1 ! -name 'static' ! -name 'index.html') gs://$BUCKET_NAME/

# Step 3: Upload index.html with no cache
gsutil -h "Cache-Control:no-cache, max-age=0" cp build/index.html gs://$BUCKET_NAME/

# Step 4: Upload build/static with 31536000 cache
gsutil -m -h "Cache-Control:public, max-age=31536000" cp -r build/static/* gs://$BUCKET_NAME/static/

echo "Upload completed successfully."
