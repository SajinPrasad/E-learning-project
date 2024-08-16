from rest_framework import serializers

from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for creating and managing Category instances.
    """

    class Meta:
        model = Category
        fields = ["name", "description", "parent"]


class SubCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for creating and managing Sub Categories.
    """

    parent = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), required=True
    )

    class Meta:
        model = Category
        fields = ["id", "name", "description", "parent"]

    def create(self, validated_data):
        parent = validated_data.get("parent")
        # Ensure the parent is a valid category
        if not Category.objects.filter(id=parent.id).exists():
            raise serializers.ValidationError({"parent": "Invalid parent category."})
        return super().create(validated_data)

    def update(self, instance, validated_data):
        parent = validated_data.get("parent")
        # Ensure the parent is a valid category
        if not Category.objects.filter(id=parent.id).exists():
            raise serializers.ValidationError({"parent": "Invalid parent category."})
        return super().update(instance, validated_data)
