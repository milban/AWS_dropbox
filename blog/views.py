import json

from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from rest_framework.response import Response

from blog.LoginAccess import Access
from blog.S3.S3connect import bucket
from blog.forms import UserLoginForm, UserRegistForm, DocumentForm
from blog.models import User, File
from blog.serializers import FileSerializer


class Home_View(View):
    def get(self, request):
        # if Access.getuserstate():
        # return redirect('main_page')
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
        if Access.getuserstate():
            redirect(request, 'main_page')
        form = UserRegistForm()
        return render(request, 'blog/regist_page.html', {'form': form, 'message': self.message})

    def post(self, request):
        form = UserRegistForm(request.POST)
        if form.is_valid():
            form.save()
            user_id = form.cleaned_data['User_Id']
            userfile = File(File_Name=user_id + "/",
                            Owner=User.objects.get(User_Id=user_id),
                            upload_date=timezone.now())
            userfile.save()
            return redirect('login_page')
        else:
            self.message = "Regist Error"
            return render(request, 'blog/regist_page.html', {'form': form, 'message': self.message})

    # 회원가입
    def regist(request):
        if request.method == "GET":
            return render(request, 'blog/regist_page.html')

        elif request.method == 'POST':
            signup_form = UserRegistForm(request.POST)
            if signup_form.is_valid():
                # signup_form.signup()
                new_user = User.objects.create_user(
                    signup_form.cleaned_data['User_Id'],
                    signup_form.cleaned_data['User_Password'],
                    signup_form.cleaned_data['User_Nickname']
                )
                new_user.save()

                return redirect(UserLoginForm)
        else:
            signup_form = UserRegistForm()

        context = {
            'signup_form': signup_form,
        }
        return render(request, 'blog/html/login.html')


@method_decorator(csrf_exempt, name='dispatch')
class Main_View(View):
    mybucket = bucket()

    def get(self, request):
        if Access.getuserstate():
            return render(request, 'blog/html/fileService.html')
        else:
            return redirect('home_page')

    def post(self, request):

        # 파일 리스트 불러오기
        # form data
        # {  "request" : "file_load",
        #    "user_id" : "유저이름", ex > user
        #    "curPath" : "디렉토리 이름"} ex > KhuKhuBox/
        if request.POST.get("request") == "file_load":
            filelist = []
            curPath = request.POST.get("curPath")
            user_id = request.POST.get("user_id")
            fileStorage = File.objects.filter(Owner__User_Id=user_id)
            for file in fileStorage:
                if file.File_Name.find(curPath) == 0:
                    name = file.File_Name[len(curPath):]
                    if len(name) == 0:
                        continue

                    isDir = name.find("/")
                    if (isDir == -1 or isDir == (len(name) - 1)):
                        filelist.append(file.File_Name)

            queryset = File.objects.filter(File_Name__in=filelist)
            serializer = FileSerializer(queryset, many=True)
            return HttpResponse(json.dumps(serializer.data), content_type="application/json")
        # 파일 업로드
        # form data
        # {  "request" : "file_upload",
        #    "file_name" : "파일이름",  ex > file.txt
        #    "user_id" : "유저이름", ex > user
        #    "curPath" : "디렉토리 이름" } ex > KhuKhuBox/
        elif request.POST.get("request") == "file_upload":
            file_name = request.POST.get("file_name")
            user_id = request.POST.get("user_id")
            path = request.POST.get("curPath")

            try:
                file = File.objects.get(File_Name=path + file_name, Owner__User_Id=user_id)
                self.bucket_delete_file(file_name, user_id)
                file.delete()
            except File.DoesNotExist:
                pass

            file_url = self.bucket_put_file(path + file_name)

            self.file_save(path + file_name, user_id)  # ex > KhuKhuBox/file.txt
            context = {'file_url': file_url}
            return HttpResponse(json.dumps(context), content_type="application/json")

        # 파일 삭제
        # form data
        # {  "request" : "file_delete",
        #    "file_name" : "파일이름",  ex > file.txt
        #    "user_id" : "유저이름", ex > user
        #    "curPath" : "디렉토리 이름" } ex > KhuKhuBox/
        elif request.POST.get("request") == "file_delete":
            file_name = request.POST.get("file_name")
            user_id = request.POST.get("user_id")
            curPath = request.POST.get("curPath")
            fileStorage = File.objects.filter(Owner__User_Id=user_id)

            filelist = file_name.split(",")
            for file in filelist:
                self.file_delete(curPath + file, user_id, fileStorage)  # DB 파일제거

            context = {'status': "ok"}
            return HttpResponse(json.dumps(context), content_type="application/json")

        # 파일 다운로드 URL받아오기
        # form data
        # {  "request" : "file_download",
        #    "file_name" : "파일이름",  ex > KhuKhuBox/file.txt
        #    "user_id" : "유저이름", ex > user
        #    "curPath" : "디렉토리 이름" } ex > KhuKhuBox/
        elif request.POST.get("request") == "file_download":
            file_name = request.POST.get("file_name")
            user_id = request.POST.get("user_id")
            path = request.POST.get("curPath")
            # KhuKhuBox/file.txt 에서 KhuKhuBox 제거 -> file.txt
            file_name = file_name[len(path):]
            file_url = self.bucket_download_file(path + file_name)  # url 받아오기

            print(file_url)
            context = {'file_url': file_url}
            return HttpResponse(json.dumps(context), content_type="application/json")

        # 파일 URL받아오기
        # form data
        # {  "request" : "file_url",
        #    "file_name" : "파일이름",  ex > KhuKhuBox/file.txt
        #    "user_id" : "유저이름", ex > user
        #    "curPath" : "디렉토리 이름" } ex > KhuKhuBox/
        elif request.POST.get("request") == "file_url":
            file_name = request.POST.get("file_name")
            user_id = request.POST.get("user_id")
            path = request.POST.get("curPath")
            # KhuKhuBox/file.txt 에서 KhuKhuBox 제거 -> file.txt
            file_name = file_name[len(path):]
            file_url = self.bucket_download_file(file_name, user_id)  # url 받아오기

            context = {'file_url': file_url}
            return HttpResponse(json.dumps(context), content_type="application/json")

        # 디렉토리 생성
        # form data
        # {  "request" : "create_directory",
        #    "user_id" : "유저이름", ex > user
        #    "curPath" : "디렉토리 이름" } ex > KhuKhuBox/
        elif request.POST.get("request") == "create_directory":
            directory_name = request.POST.get("curPath")
            user_id = request.POST.get("user_id")
            self.file_save(directory_name, user_id)
            context = {'status': "ok"}
            return HttpResponse(json.dumps(context), content_type="application/json")

        return render(request, 'blog/html/fileService.html')

    def bucket_put_file(self, file):
        return self.mybucket.put_object(file)
        # view 요청이 끝나면 Main_View의 object가 소멸해서 filelist에 설정해도 사라짐.
        # self.filelist = File.objects.filter(Owner__User_Id=Access.getuserid())

    def bucket_delete_file(self, file):
        self.mybucket.delete_object(file)
        # view 요청이 끝나면 Main_View의 object가 소멸해서 filelist에 설정해도 사라짐.
        # self.filelist = File.objects.filter(Owner__User_Id=Access.getuserid())

    def bucket_download_file(self, file):
        return self.mybucket.download_object(file)

    def file_save(self, file_name, user_id):
        userfile = File(File_Name=file_name, Owner=User.objects.get(User_Id=user_id),
                        upload_date=timezone.now())
        userfile.save()

    def file_delete(self, file_name, user_id, fileStorage):
        if (file_name[-1] == '/'):
            for file in fileStorage:
                if file.File_Name.find(file_name) == 0:
                    name = file.File_Name[len(file_name):]
                    isDir = name.find("/")
                    if file.File_Name != file_name:
                        if isDir == -1 or name[-1] == '/':
                            self.file_delete(file.File_Name, user_id, fileStorage)
        else:
            self.bucket_delete_file(file_name)

        userfile = File.objects.get(File_Name=file_name, Owner=User.objects.get(User_Id=user_id))
        userfile.delete()


class Access_Fail_View(View):
    def get(self, request):
        return render(request, 'blog/access_fail.html')

