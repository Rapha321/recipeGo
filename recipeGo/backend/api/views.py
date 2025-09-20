from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from .serializers import UserSerializer, RecipeSerializer, FavoriteSerializer, TagSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Recipe, Tag, Profile
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound


class RecipeListView(generics.ListCreateAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    # Get the recipes created by the authenticated user
    def get_queryset(self):
        user = self.request.user
        return Recipe.objects.filter(created_by=user)

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
        user = self.request.user
        return Recipe.objects.filter(created_by=user)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny] 


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


class RecipeDetailView(generics.RetrieveAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Recipe.objects.all()


class RecipeTagAttachView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            recipe = Recipe.objects.get(pk=pk, created_by=request.user)
        except Recipe.DoesNotExist:
            raise NotFound("Recipe not found")

        tag_id = request.data.get("tag_id")
        if not tag_id:
            raise ValidationError({"detail": "tag_id is required"})

        try:
            tag = Tag.objects.get(pk=tag_id, created_by=request.user)
        except Tag.DoesNotExist:
            raise NotFound("Tag not found")

        recipe.tags.add(tag)
        return Response({"detail": f"Tag '{tag.name}' attached to recipe"}, status=200)


class RecipeTagDetachView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            recipe = Recipe.objects.get(pk=pk, created_by=request.user)
        except Recipe.DoesNotExist:
            raise NotFound("Recipe not found")

        tag_id = request.data.get("tag_id")
        if not tag_id:
            raise ValidationError({"detail": "tag_id is required"})

        try:
            tag = Tag.objects.get(pk=tag_id, created_by=request.user)
        except Tag.DoesNotExist:
            raise NotFound("Tag not found")

        recipe.tags.remove(tag)
        return Response({"detail": f"Tag '{tag.name}' removed from recipe"}, status=200)


class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({"user_id": user.id})