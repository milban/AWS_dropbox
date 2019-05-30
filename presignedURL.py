import logging
import boto3
from botocore.exceptions import ClientError
import requests


def presigned_url(bucket_name, file_name, expiration=600):

    url = None
    s3_client = boto3.client('s3')
    try:
        url = s3_client.generate_presigned_url(
            'get_object',Params={'Bucket': bucket_name,'Key': file_name},ExpiresIn=expiration)
    except ClientError as e:
        logging.error(e)

    if url is not None:
        response = requests.get(url)
