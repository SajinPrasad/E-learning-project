# from django_elasticsearch_dsl import Document, Index, fields
# from django_elasticsearch_dsl.registries import registry
# from django.db.models.signals import post_save, post_delete
# from django.dispatch import receiver

# from .models import Course, Category

# # Define the Elasticsearch index for courses
# course_index = Index("courses")
# course_index.settings(number_of_shards=1, number_of_replicas=0)


# # Document for Category model
# @registry.register_document
# class CategoryDocument(Document):
#     subcategories = fields.ObjectField(
#         properties={
#             "name": fields.TextField(),
#             "description": fields.TextField(),
#         }
#     )

#     class Index:
#         # Name of the Elasticsearch index
#         name = "categories"
#         settings = {"number_of_shards": 1, "number_of_replicas": 0}

#     class Django:
#         model = Category
#         fields = [
#             "name",
#             "description",
#             "is_active",
#             "created_at",
#             "updated_at",
#         ]


# # Document for Course model
# @registry.register_document
# class CourseDocument(Document):
#     category = fields.ObjectField(
#         properties={
#             "name": fields.TextField(),
#             "description": fields.TextField(),
#         }
#     )
#     mentor = fields.ObjectField(
#         properties={
#             "username": fields.TextField(),
#             "email": fields.TextField(),
#         }
#     )

#     class Index:
#         # Name of the Elasticsearch index
#         name = "courses"
#         settings = {"number_of_shards": 1, "number_of_replicas": 0}

#     class Django:
#         model = Course
#         fields = [
#             "title",
#             "description",
#             "status",
#             "created_at",
#             "updated_at",
#         ]


# @receiver(post_save, sender=Course)
# def update_course_in_elasticsearch(sender, instance, **kwargs):
#     CourseDocument().update(instance)


# @receiver(post_delete, sender=Course)
# def delete_course_from_elasticsearch(sender, instance, **kwargs):
#     CourseDocument().delete(instance)


# @receiver(post_save, sender=Category)
# def update_category_in_elasticsearch(sender, instance, **kwargs):
#     CategoryDocument().update(instance)


# @receiver(post_delete, sender=Category)
# def delete_category_from_elasticsearch(sender, instance, **kwargs):
#     CategoryDocument().delete(instance)
