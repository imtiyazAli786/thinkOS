#!/bin/bash
echo "Setting CORS configuration for Firebase Storage buckets..."

# Try using gcloud storage first, fallback to gsutil
if command -v gcloud &> /dev/null; then
  echo "Using gcloud storage..."
  gcloud storage buckets update gs://focused-dashboard-f0639.firebasestorage.app --cors-file=cors.json || true
  gcloud storage buckets update gs://focused-dashboard-f0639.appspot.com --cors-file=cors.json || true
elif command -v gsutil &> /dev/null; then
  echo "Using gsutil..."
  gsutil cors set cors.json gs://focused-dashboard-f0639.firebasestorage.app || true
  gsutil cors set cors.json gs://focused-dashboard-f0639.appspot.com || true
else
  echo "Neither gcloud nor gsutil found on system."
  echo "Please run in Google Cloud Shell:"
  echo "gcloud storage buckets update gs://focused-dashboard-f0639.firebasestorage.app --cors-file=cors.json"
fi
