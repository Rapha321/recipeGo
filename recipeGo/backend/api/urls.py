from django.urls import path, re_path
from django.views.static import serve
from django.conf import settings
from . import views

urlpatterns = [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root':settings.MEDIA_ROOT}),
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root':settings.STATIC_ROOT}),

    # Recipe
    path('recipes/all-recipes/', views.AllRecipesListView.as_view(), name='all-recipes-list'),
    path('recipes/', views.RecipeListView.as_view(), name='recipe-list'),
    path('recipes/create/', views.RecipeCreate.as_view(), name='create-recipe'),
    path('recipes/update/<int:pk>/', views.RecipeUpdateView.as_view(), name='update-recipe'),
    path('recipes/delete/<int:pk>/', views.RecipeDelete.as_view(), name='delete-recipe'),
    path('recipes/<int:pk>/attach_tag/', views.RecipeTagAttachView.as_view(), name='recipe-tag-attach'),
    path('recipes/<int:pk>/detach_tag/', views.RecipeTagDetachView.as_view(), name='recipe-tag-detach'),
    path('recipes/<int:pk>/', views.RecipeDetailView.as_view(), name='recipe-detail'),

    # Favorites
    path('favorites/', views.FavoriteListView.as_view(), name='favorite-list'),
    path('favorites/add/', views.FavoriteCreateView.as_view(), name='favorite-recipes'),
    path('favorites/delete/<int:pk>/', views.FavoriteDestroyView.as_view(), name='favorite-delete'),

    # Tags
    path('tags/', views.TagListCreateView.as_view(), name='tag-list-create'),
    path('tags/delete/<int:pk>/', views.TagDeleteView.as_view(), name='tag-delete'),

    # Profile and User info
    path('user/info/', views.UserInfoView.as_view(), name='user-info'),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('profiles/', views.AllProfilesView.as_view(), name='user-profiles'),
    path('profile/update/', views.ProfileUpdateView.as_view(), name='profile-update'),


    # Comment
    path('recipes/<int:pk>/comments/create/', views.CommentCreateView.as_view(), name='create-comment'),
    path('recipes/<int:pk>/comments/', views.CommentListView.as_view(), name='recipe-comments'),
    path('comments/delete/<int:pk>/', views.CommentDeleteView.as_view(), name='delete-comment'),
    path('comments/update/<int:pk>/', views.CommentUpdateView.as_view(), name='update-comment'),


]
