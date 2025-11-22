from django.test import TestCase, Client
from django.urls import reverse

class PortfolioTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_home_view(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Alex Dev")

    def test_projects_view(self):
        response = self.client.get(reverse('projects'))
        self.assertEqual(response.status_code, 200)

    def test_blog_view(self):
        response = self.client.get(reverse('blog'))
        self.assertEqual(response.status_code, 200)

    def test_project_detail_view(self):
        # Test with ID 1 which exists
        response = self.client.get(reverse('project_detail', args=[1]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "NeonCommerce Dashboard")

    def test_blog_detail_view(self):
        # Test with ID 1 which exists
        response = self.client.get(reverse('blog_detail', args=[1]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Mastering React 18 Concurrency")
