from django.urls import path
from . import views

urlpatterns = [
    path('recipes/all-recipes/', views.AllRecipesListView.as_view(), name='all-recipes-list'),
    path('recipes/', views.RecipeListView.as_view(), name='recipe-list'),
    path('recipes/create/', views.RecipeCreate.as_view(), name='create-recipe'),
    path('recipes/delete/<int:pk>/', views.RecipeDelete.as_view(), name='delete-recipe'),

    # Add single recipe retrieve (needed to get recipe tags)
    path('recipes/<int:pk>/', views.RecipeDetailView.as_view(), name='recipe-detail'),

    # Favorites
    path('favorites/', views.FavoriteListView.as_view(), name='favorite-list'),
    path('favorites/add/', views.FavoriteCreateView.as_view(), name='favorite-recipes'),
    path('favorites/delete/<int:pk>/', views.FavoriteDestroyView.as_view(), name='favorite-delete'),

    # Tags
    path('tags/', views.TagListCreateView.as_view(), name='tag-list-create'),
    path('tags/delete/<int:pk>/', views.TagDeleteView.as_view(), name='tag-delete'),

    # Recipe tag attach/detach
    path('recipes/<int:pk>/attach_tag/', views.RecipeTagAttachView.as_view(), name='recipe-tag-attach'),
    path('recipes/<int:pk>/detach_tag/', views.RecipeTagDetachView.as_view(), name='recipe-tag-detach'),

    path('user/info/', views.UserInfoView.as_view(), name='user-info'),
]
