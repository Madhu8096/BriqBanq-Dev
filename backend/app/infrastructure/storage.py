"""
AWS S3 storage infrastructure module.
Private bucket with signed URLs for document access.
"""

from typing import Optional

import boto3
from botocore.exceptions import ClientError

from app.core.config import settings


class StorageClient:
    """S3 storage client for document management."""

    def __init__(self):
        self._client = None

    def _get_client(self):
        if not self._client:
            self._client = boto3.client(
                "s3",
                region_name=settings.aws_region,
                aws_access_key_id=settings.aws_access_key_id,
                aws_secret_access_key=settings.aws_secret_access_key,
            )
        return self._client

    async def upload_file(
        self, file_content: bytes, key: str, content_type: str = "application/octet-stream"
    ) -> str:
        """Upload a file to S3 and return the key."""
        try:
            client = self._get_client()
            client.put_object(
                Bucket=settings.s3_bucket_name,
                Key=key,
                Body=file_content,
                ContentType=content_type,
                ServerSideEncryption="AES256",
            )
            return key
        except ClientError as e:
            raise RuntimeError(f"Failed to upload file: {e}")

    async def generate_signed_url(self, key: str, expiry: int = 3600) -> str:
        """Generate a pre-signed URL for secure document access."""
        try:
            client = self._get_client()
            url = client.generate_presigned_url(
                "get_object",
                Params={"Bucket": settings.s3_bucket_name, "Key": key},
                ExpiresIn=expiry,
            )
            return url
        except ClientError as e:
            raise RuntimeError(f"Failed to generate signed URL: {e}")

    async def delete_file(self, key: str) -> None:
        """Delete a file from S3."""
        try:
            client = self._get_client()
            client.delete_object(Bucket=settings.s3_bucket_name, Key=key)
        except ClientError as e:
            raise RuntimeError(f"Failed to delete file: {e}")


# Singleton storage client
storage_client = StorageClient()
