import boto3
import ast

from flask import Flask, flash, redirect, render_template, \
     request, url_for
s3 = boto3.resource('s3',
     aws_access_key_id='/Security issues/',
                       aws_secret_access_key='Security Issues')
bucket = s3.Bucket('trailbucket2794')


app = Flask(__name__)
app.secret_key = 'some_secret'

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    details_dict={'admin': '123'}
    error = None
    if request.method == 'POST':
        for key, value in details_dict.items():
            if request.form['username'] != key or \
                    request.form['password'] != value:
                error = 'Invalid credentials'
            else:
                flash('You were successfully logged in')
                return redirect(url_for('upload_file'))
    return render_template('login.html', error=error)

#Uploading a file in Amazon S3
@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == "POST":
        file = request.files['file']
        file_name = file.filename
        # data = open('UTA_Athletics_logo.png', 'rb')
        s3.Bucket('trailbucket2794').put_object(Key='new/'+file_name, Body=file)
        return "Filename  " + file_name + "  is uploaded"
    return render_template('index_new.html')

#Listing a file in Amazon S3
@app.route('/list_files', methods=['GET', 'POST'])
def return_file():
    return_document = []
    if request.method == "POST":
        for buc in bucket.objects.all():
            # for key in buc.objects.all():
                print(buc.key)
                return_document.append(buc.key)
        print(return_document)
    return render_template('index_new.html', return_document=return_document)

#Deleting a file in Amazon S3
@app.route('/delete', methods=['GET', 'POST'])
def delete():
    if request.method == "POST":
        file_name = request.form['filename']
        for buc in bucket.objects.all():
            print(buc)
            if file_name == buc.key:
                buc.delete()
        return "Filename=" + file_name + " has been deleted!.."
    return render_template('index_new.html')

@app.route('/download', methods=['GET', 'POST'])
def download_file():
        file_name = request.form['filename']
        srcBucket = s3.get_bucket('trailbucket2794')
        dstBucket = s3.get_bucket('newbucket27')
        dstBucket.copy_key(file_name,srcBucket.name,file_name)
        return render_template('index_new.html')

if __name__ == '__main__':
    app.run(port=8000)
