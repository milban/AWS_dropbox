import boto3


# S3를 연결하기 위한 class
class bucket:
    __bucket = "khu_box"

    def __init__(self):
        self.s3client = boto3.client('s3')

    def put_object(self, userid, filename):
        path = userid + "/" + filename
        return self.s3client.generate_presigned_post(self.__bucket, path, ExpiresIn=120)

    def delete_object(self, userid, filename):
        path = userid + "/" + filename
        self.s3client.delete_object(Bucket=self.__bucket, Key=path)

    def download_object(self, userid, filename):
        path = userid + "/" + filename
        return self.s3client.generate_presigned_url('get_object', Params={'Bucket': self.__bucket, 'Key': path}, ExpiresIn=120)
