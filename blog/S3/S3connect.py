import boto3


# S3를 연결하기 위한 class
class bucket:
    __key_id = "**"
    __secret_key = "**"
    __token = "**"
    __bucket = "**"

    def __init__(self):
        self.s3client = boto3.client('s3',
                                     aws_access_key_id=self.__key_id,
                                     aws_secret_access_key=self.__secret_key,
                                     aws_session_token=self.__token)
        self.s3resource = boto3.resource('s3',
                                         aws_access_key_id=self.__key_id,
                                         aws_secret_access_key=self.__secret_key,
                                         aws_session_token=self.__token)

    def put_object(self, userid, filename, file):
        path = userid + "/" + filename
        self.s3client.put_object(Bucket=self.__bucket, Key=path, Body=file)

    def delete_object(self, userid, filename):
        path = userid + "/" + filename
        self.s3client.delete_object(Bucket=self.__bucket, Key=path)

    def download_object(self, userid, filename):
        path = userid + "/" + filename
        self.s3resource.meta.client.download_file(self.__bucket, path, filename)
