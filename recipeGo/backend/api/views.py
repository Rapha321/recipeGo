from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from .serializers import UserSerializer, RecipeSerializer, FavoriteSerializer, TagSerializer, UserAndProfileSerializer, UserRegistrationSerializer, CommentSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Recipe, Tag, Profile, Comment
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError


# Recipe
class RecipeListView(generics.ListCreateAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    # Get the recipes created by the authenticated user
    def get_queryset(self):
        return Recipe.objects.filter(created_by=self.request.user)

    # Override the perform_create method to set the user as the creator of the recipe
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(created_by=self.request.user)
        else:
            print(serializer.errors)

class AllRecipesListView(generics.ListAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [AllowAny]

    # Get the recipes created by the authenticated user
    def get_queryset(self):
        return Recipe.objects.all().order_by('-created_at')

class RecipeCreate(generics.CreateAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class RecipeDelete(generics.DestroyAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Recipe.objects.filter(created_by=self.request.user)

class RecipeUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        pk = self.kwargs.get('pk')
        return Recipe.objects.get(pk=pk, created_by=self.request.user)

class RecipeDetailView(generics.RetrieveAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Recipe.objects.all()

class RecipeTagAttachView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            recipe = Recipe.objects.get(pk=pk, created_by=self.request.user)
        except Recipe.DoesNotExist:
            raise NotFound("Recipe not found")

        tag_id = request.data.get("tag_id")
        if not tag_id:
            raise ValidationError({"detail": "tag_id is required"})

        try:
            tag = Tag.objects.get(pk=tag_id, created_by=self.request.user)
        except Tag.DoesNotExist:
            raise NotFound("Tag not found")

        recipe.tags.add(tag)
        return Response({"detail": f"Tag '{tag.name}' attached to recipe"}, status=200)

class RecipeTagDetachView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            recipe = Recipe.objects.get(pk=pk, created_by=self.request.user)
        except Recipe.DoesNotExist:
            raise NotFound("Recipe not found")

        tag_id = request.data.get("tag_id")
        if not tag_id:
            raise ValidationError({"detail": "tag_id is required"})

        try:
            tag = Tag.objects.get(pk=tag_id, created_by=self.request.user)
        except Tag.DoesNotExist:
            raise NotFound("Tag not found")

        recipe.tags.remove(tag)
        return Response({"detail": f"Tag '{tag.name}' removed from recipe"}, status=200)


# User
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        
        # Add tokens to the response
        user = User.objects.get(username=request.data['username'])
        refresh = RefreshToken.for_user(user)
        
        response.data.update({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
        
        return response


# Favorite
class FavoriteListView(generics.ListAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return all favorite recipes for the authenticated user
        return self.request.user.profile.favorites.all()

class FavoriteCreateView(generics.CreateAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()
        
class FavoriteDestroyView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        # Get the recipe based on the URL's primary key (pk)
        recipe_id = self.kwargs.get('pk')
        try:
            recipe = Recipe.objects.get(id=recipe_id)
            # Ensure the user has the recipe in their favorites before deleting
            if self.request.user.profile.favorites.filter(id=recipe_id).exists():
                self.request.user.profile.favorites.remove(recipe)
                return recipe
            else:
                raise status.NotFound("Recipe not found in user's favorites")
        except Recipe.DoesNotExist:
            raise status.NotFound("Recipe not found")

    def destroy(self, request, *args, **kwargs):
        # The get_object method already handles the logic
        self.get_object()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Tag
class TagListCreateView(generics.ListCreateAPIView):
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # return only tags creted by this user
        return Tag.objects.filter(created_by=self.request.user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class TagDeleteView(generics.DestroyAPIView):
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Tag.objects.filter(created_by=self.request.user)


# User
class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        profile_data = None
        if hasattr(user, 'profile'):
            profile = user.profile
            profile_data = {
                'bio': profile.bio,
                'image': request.build_absolute_uri(profile.image.url) if profile.image else None,
            }

        return Response({
                "user_id": user.id, 
                "first_name": user.first_name, 
                "last_name": user.last_name,
                "profile": profile_data
            })

class UserProfileView(RetrieveAPIView):
    serializer_class = UserAndProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile
    
class AllProfilesView(generics.ListAPIView):
    serializer_class = UserAndProfileSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Profile.objects.all()

class ProfileUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = UserAndProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile


# Comment
class CommentCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        recipe_id = self.kwargs['pk']
        try:
            recipe = Recipe.objects.get(pk=recipe_id)
        except Recipe.DoesNotExist:
            raise NotFound("Recipe not found.")
        
        # Save the comment with the correct author and recipe
        serializer.save(created_by=self.request.user, recipe=recipe)

class CommentListView(generics.ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]

    # Get the comments created by the authenticated user
    def get_queryset(self):
        recipe_id = self.kwargs['pk']
        # Return only the comments for the specified recipe
        return Comment.objects.filter(recipe__id=recipe_id).order_by('-created_at')

class CommentDeleteView(generics.DestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only allow the author of the comment to delete it
        return Comment.objects.filter(created_by=self.request.user)

class CommentUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Only allow the author of the comment to update it
        return Comment.objects.filter(created_by=self.request.user)
