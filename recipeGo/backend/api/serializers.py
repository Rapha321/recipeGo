from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Recipe, Profile, Tag, Comment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "username", "password"]
        extra_kwargs = {
            "password": {"write_only": True} # it tells Django that we want to accept the password when we are creating a new user but we dont want to give the password when we are sending information about a User
        }

    # Create a new user 
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserAndProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)

    class Meta:
        model = Profile
        fields = ['user', 'first_name', 'last_name', 'bio', 'image']

    def update(self, instance, validated_data):
        # Extract user data directly from validated_data using the source field
        user_data = validated_data.pop('user', {})

        # Update fields on the Profile instance
        instance.bio = validated_data.get('bio', instance.bio)
        instance.image = validated_data.get('image', instance.image)
        instance.save()

        # Update fields on the related User instance
        user = instance.user
        user.first_name = user_data.get('first_name', user.first_name)
        user.last_name = user_data.get('last_name', user.last_name)
        user.save()

        return instance

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
        fields = ['bio', 'image', 'favorites']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class CommentSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'recipe', 'created_by', 'content', 'created_at', 'updated_at']
        read_only_fields = ['recipe', 'created_by', 'created_at', 'updated_at']