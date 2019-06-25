from rest_framework import serializers

from blog.models import File


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ('File_Name', 'upload_date')  # 필드 설정
