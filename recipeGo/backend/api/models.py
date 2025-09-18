from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    favorites = models.ManyToManyField('Recipe', related_name='favorited_by', blank=True)

    def __str__(self):
        return self.user.username

class Recipe(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    ingredients = models.TextField()
    instructions = models.TextField()
    prep_time = models.DurationField()
    public = models.BooleanField(default=False)
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="recipes")
    tags = models.ManyToManyField("Tag", related_name="recipes", blank=True)

    def __str__(self):
        return self.title


class Tag(models.Model):
    name = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tags")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["name", "created_by"], name="unique_user_tag")
        ]

    def __str__(self):
        return self.name