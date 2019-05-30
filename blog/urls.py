from django.urls import path

from blog import views

urlpatterns = [
    path('', views.Home_View.as_view(), name='home_page'),
    path('login/', views.Login_VIew.as_view(), name='login_page'),
    path('regist/', views.Regist_View.as_view(), name='regist_page'),
    path('main/', views.Main_View.as_view(), name='main_page'),
    path('access_fail/', views.Access_Fail_View.as_view(), name='access_fail'),
]
