import boto3


# S3를 연결하기 위한 class
class bucket:
    __bucket = "khu-box"
    # __bucket = "my-django-bucket"
    #
    # access_key = ""
    # secret_key = ""
    # token = ""

    def __init__(self):
        self.s3client = boto3.client('s3')
        # self.s3client = boto3.client('s3', aws_access_key_id=self.access_key, aws_secret_access_key=self.secret_key,
        #                              aws_session_token=self.token)

    def put_object(self, userid, filename):
        path = userid + "/" + filename
        return self.s3client.generate_presigned_url('put_object', Params={'Bucket':self.__bucket, 'Key':path}, ExpiresIn=120, HttpMethod = 'PUT')

    def delete_object(self, userid, filename):
        path = userid + "/" + filename
        self.s3client.delete_object(Bucket=self.__bucket, Key=path)

    def download_object(self, userid, filename):
        path = userid + "/" + filename
        return self.s3client.generate_presigned_url('get_object', Params={'Bucket': self.__bucket, 'Key': path}, ExpiresIn=120, HttpMethod = 'GET')
