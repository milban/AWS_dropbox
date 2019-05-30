import boto


def presignedURL(bucketName, fileName):
	conn=boto.connect_s3()
	URL = conn.generage_url(120, 'GET', bucket=bucketName, key=fileName)

	return URL

presignedURL('urltest-bucket', 'test.txt')