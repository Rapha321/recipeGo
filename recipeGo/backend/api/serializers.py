from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Recipe, Profile, Tag


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {
            "password": {"write_only": True} # it tells Django that we want to accept the password when we are creating a new user but we dont want to give the password when we are sending information about a User
        }

    # Create a new user 
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class FavoriteSerializer(serializers.Serializer):
    recipe_id = serializers.IntegerField(write_only=True)

    def create(self, validated_data):
        user = self.context['request'].user
        recipe_id = validated_data.get('recipe_id')

        try:
            recipe = Recipe.objects.get(id=recipe_id)

            # Ensure profile exists
            profile, _ = Profile.objects.get_or_create(user=user)

            # Add recipe to favorites
            profile.favorites.add(recipe)

            return recipe
        except Recipe.DoesNotExist:
            raise serializers.ValidationError("Recipe with this ID does not exist.")

    def to_representation(self, instance):
        # Return full recipe details
        return RecipeSerializer(instance).data


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'created_at', 'created_by']
        read_only_fields = ['id', 'created_at', 'created_by']

    # def create(self, validated_data):
    #     user = self.context['request'].user
    #     name = validated_data.get('name')

    #     tag, created = Tag.objects.get_or_create (
    #         name=name,
    #         created_by=user
    #     )

    #     if not created: 
    #         raise serializers.ValidationError("Tag with this name already exists.")

    #     return tag


class RecipeSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)  # Show tag details

    class Meta:
        model = Recipe
        fields = "__all__"  
        read_only_fields = ["created_at", "created_by"]


class ProfileSerializer(serializers.ModelSerializer):
    # This field will show the full recipe details when a profile is requested
    favorites = RecipeSerializer(many=True, read_only=True)
    class Meta:
        model = Profile
        fields = ["favorites"]