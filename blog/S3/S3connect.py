import boto3


# S3를 연결하기 위한 class
class bucket:
    __bucket = "khu_box"
    # __bucket = "my-django-bucket"
    #
    # access_key = "ASIAQZWTYT4BGA2WO5N4"
    # secret_key = "ilA1rkSvjKLDi/GYB5KeIGQHYPkQ8khr7UGUAGii"
    # token = "FQoGZXIvYXdzEHUaDNLPPio/fAEr5RQvgSKAA25KoeQkE3XPytbpwI6L63Y6tZHqqJaxSjprAP1V5oWwaiou/ZG3SPYKhtSweHDLY5LldpThOQ80aUrdsuNmENzEoysgMDh6xPyrwjRNbNkz02O2Ef/MuXYcdkMEBS8lDyjXXqtJ/1SxO7A7L1KI9HXUoz0udgRepTls8QFvGF5WvdLUmPPrEDmBNHE+S1wpEOnnfD+aA21UFahcILDnu0V9AhL+jnDm6I2VIL9NZcNZryCanZlj5CybzTe6IL5DvOLc+bK9AEsRUrzUDx/qs8AmSjOWKOgEXdEuCseYuyMR/7GdheVOVAy7Go98JvrO2OMCJIBz90crwPcc/olCYVmcXKMbhuvJ7dQN/+L16WIbPtUpu6FsIwLnTKeye4ZVc0wwYWIDPFuovqjM2S1CSYd1oUEIPvkdF6+e2y1N3W9vbaHFLr5EGN0fG5UNhDdt4ySXUXujuq3v7Hf0aJH9spBF0u/kYBfmSIXAON3tgLEbXTQRQCWfvJvTc2/gMxUXDSj6+fjnBQ=="

    def __init__(self):
        self.s3client = boto3.client('s3')
        # self.s3client = boto3.client('s3', aws_access_key_id=self.access_key, aws_secret_access_key=self.secret_key,
        #                              aws_session_token=self.token)

    def put_object(self, userid, filename):
        path = userid + "/" + filename
        return self.s3client.generate_presigned_url('put_object', Params={'Bucket': self.__bucket, 'Key': path},
                                                    ExpiresIn=120, HttpMethod='PUT')

    def delete_object(self, userid, filename):
        path = userid + "/" + filename
        self.s3client.delete_object(Bucket=self.__bucket, Key=path)

    def download_object(self, userid, filename):
        path = userid + "/" + filename
        return self.s3client.generate_presigned_url('get_object', Params={'Bucket': self.__bucket, 'Key': path},
                                                    ExpiresIn=120, HttpMethod='GET')
