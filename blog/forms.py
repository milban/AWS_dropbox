from django import forms

from blog.models import User, Document


class UserLoginForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('User_Id', 'User_Password',)


class UserRegistForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('User_Id', 'User_Password', 'User_Nickname')


class DocumentForm(forms.ModelForm):
    class Meta:
        model = Document
        fields = ('file',)
