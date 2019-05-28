from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.views.generic import View

from blog.LoginAccess import Access
from blog.S3.S3connect import bucket
from blog.forms import UserLoginForm, UserRegistForm, DocumentForm
from blog.models import User, File


class Login_VIew(View):
    message = ""

    def get(self, request):
        return render(request, 'blog/login_page.html', {'message': self.message})

    def post(self, request):
        post = request.POST
        id = post.get("User_Id")
        pw = post.get("User_Password")

        try:
            user = User.objects.get(User_Id=id)
            if user.User_Password == pw:
                # Login 성공
                Access.setaccess(user)
                return redirect('main_page')
            else:
                self.message = "패스워드 오류"
        except User.DoesNotExist:
            self.message = "없는 User입니다."
        return render(request, 'blog/login_page.html', {'message': self.message})


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
    nickname = ""
    mybucket = bucket()

    def get(self, request):
        if Access.getuserstate():
            self.nickname = Access.getusernickname()
            form = DocumentForm()
            userid = Access.getuserid()
            filelist = File.objects.filter(Owner__User_Id=userid)
            return render(request, 'blog/main_page.html',
                          {'nickname': self.nickname, 'form': form, 'filelist': filelist})
        else:
            return redirect('access_fail')

    def post(self, request):

        if request.POST.get("file_upload") is not None:
            form = DocumentForm(request.POST, request.FILES)
            if form.is_valid():
                file = request.FILES['file']
                self.mybucket = bucket()  # 버켓 연결
                self.bucket_put_file(file)
        elif request.POST.get("file_delete") is not None:
            self.mybucket = bucket()  # 버켓 연결
            file_name = request.POST.get("file_name")
            self.bucket_delete_file(file_name)
        elif request.POST.get("file_download") is not None:
            self.mybucket = bucket()  # 버켓 연결
            file_name = request.POST.get("file_name")
            self.bucket_download_file(file_name)

        form = DocumentForm()
        userid = Access.getuserid()
        filelist = File.objects.filter(Owner__User_Id=userid)
        return render(request, 'blog/main_page.html', {'nickname': self.nickname, 'form': form, 'filelist': filelist})

    def bucket_put_file(self, file):
        user = User.objects.get(User_Id=Access.getuserid())
        self.mybucket.put_object(user.User_Id, file.name, file)
        print(file.name)
        self.file_save(file.name)

    def bucket_delete_file(self, file_name):
        user = User.objects.get(User_Id=Access.getuserid())
        self.mybucket.delete_object(user.User_Id, file_name)

        self.file_delete(file_name)

    def bucket_download_file(self, file_name):
        user = User.objects.get(User_Id=Access.getuserid())
        self.mybucket.download_object(user.User_Id, file_name)

    def file_save(self, file_name):
        user = User.objects.get(User_Id=Access.getuserid())
        userfile = File(File_Name=file_name, Owner=user)
        userfile.save()

    def file_delete(self, file_name):
        user = User.objects.get(User_Id=Access.getuserid())
        userfile = File.objects.get(File_Name=file_name, Owner=user)
        userfile.delete()


class Access_Fail_View(View):
    def get(self, request):
        return render(request, 'blog/access_fail.html')
