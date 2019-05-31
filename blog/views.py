from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.utils import timezone
from django.views.generic import View

from blog.LoginAccess import Access
from blog.S3.S3connect import bucket
from blog.forms import UserLoginForm, UserRegistForm, DocumentForm
from blog.models import User, File


class Home_View(View):
    def get(self, request):
        return render(request, 'blog/html/index.html')


class Login_VIew(View):

    def get(self, request):
        return render(request, 'blog/html/login.html')

    def post(self, request):
        message = ""
        post = request.POST
        id = post.get("userId")
        pw = post.get("password")

        try:
            user = User.objects.get(User_Id=id)
            if user.User_Password == pw:
                # Login 성공
                Access.setaccess(user)
                return redirect('main_page')
            else:
                message = "비밀번호가 일치하지 않습니다."
        except User.DoesNotExist:
            message = "없는 User입니다."

        return render(request, 'blog/html/login.html', {'message': message})


class Regist_View(View):
    message = ""

    def get(self, request):
        form = UserRegistForm()
        return render(request, 'blog/regist_page.html', {'form': form, 'message': self.message})

    def post(self, request):
        form = UserRegistForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login_page')
        else:
            self.message = "Regist Error"
            return render(request, 'blog/regist_page.html', {'form': form, 'message': self.message})


class Main_View(View):
    mybucket = bucket()
    fileStorage = File.objects.filter(Owner__User_Id=Access.getuserid())
    curPath = "/"
    filelist = ""

    def get(self, request):
        if Access.getuserstate():
            fileset = {}
            for file in self.fileStorage:
                if file.File_name.find(self.curPath) == 0 :
                    name = file[len(self.curPath):]
                    isDir = name.find('/')
                    if isDir != -1 :
                        name = name[:(isDir + 1)]
                    fileset.add(name)
            self.filelist = list(fileset)
            return render(request, 'blog/html/fileServiece.html', {'filelist': self.filelist})
        else:
            return redirect('access_fail')

    def post(self, request):

        if request.POST.get("file_upload") is not None:
            form = DocumentForm(request.POST, request.FILES)
            if form.is_valid():
                file_name = request.POST.get("file_name")
                self.bucket_put_file(file_name)
        elif request.POST.get("file_delete") is not None:
            file_name = request.POST.get("file_name")
            self.bucket_delete_file(file_name)
        elif request.POST.get("file_download") is not None:
            file_name = request.POST.get("file_name")
            self.bucket_download_file(file_name)
        elif request.POST.get("create_directory") is not None:
            directory_name = request.POST.get("create_directory")
            self.file_save(directory_name)
        elif request.POST.get("delete_directory") is not None:
            directory_name = request.POST.get("delete_directory")
            self.file_delete(directory_name)

        return render(request, 'blog/html/fileServiece.html', {'filelist': self.filelist})

    def bucket_put_file(self, file_name):
        self.mybucket.put_object(Access.getuserid(), file_name)
        print(file_name)
        self.file_save(file_name)
        self.filelist = File.objects.filter(Owner__User_Id=Access.getuserid())

    def bucket_delete_file(self, file_name):
        self.mybucket.delete_object(Access.getuserid(), file_name)
        self.file_delete(file_name)
        self.filelist = File.objects.filter(Owner__User_Id=Access.getuserid())

    def bucket_download_file(self, file_name):
        self.mybucket.download_object(Access.getuserid(), file_name)

    def file_save(self, file_name):
        userfile = File(File_Name=file_name, Owner=User.objects.get(User_Id=Access.getuserid()),
                        upload_date=timezone.now())
        userfile.save()

    def file_delete(self, file_name):
        userfile = File.objects.get(File_Name=file_name, Owner=User.objects.get(User_Id=Access.getuserid()))
        userfile.delete()


class Access_Fail_View(View):
    def get(self, request):
        return render(request, 'blog/access_fail.html')
