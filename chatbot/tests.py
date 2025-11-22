from django.test import TestCase, Client
from django.urls import reverse
from unittest.mock import patch, MagicMock
import json

class ChatbotTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse('chat_message')

    def test_chat_message_get_method_not_allowed(self):
        """Test that GET requests are not allowed."""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 405)

    def test_chat_message_no_body(self):
        """Test that request with no body returns error."""
        response = self.client.post(self.url, content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_chat_message_invalid_json(self):
        """Test that invalid JSON returns error."""
        response = self.client.post(self.url, data="invalid json", content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_chat_message_missing_message_field(self):
        """Test that JSON without 'message' field returns error."""
        response = self.client.post(self.url, data=json.dumps({'other': 'field'}), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    @patch('chatbot.views.client')
    def test_chat_message_success(self, mock_client):
        """Test successful chat message processing."""
        # Mock the chat session and send_message_stream
        mock_chat = MagicMock()
        mock_client.chats.create.return_value = mock_chat

        # Create a mock response chunk
        mock_chunk = MagicMock()
        mock_chunk.text = "Hello there!"

        # send_message_stream returns an iterator
        mock_chat.send_message_stream.return_value = [mock_chunk]

        response = self.client.post(
            self.url,
            data=json.dumps({'message': 'Hello'}),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        # The response is a StreamingHttpResponse, so we consume it to check content
        content = b"".join(response.streaming_content).decode('utf-8')

        # Check for the expected SSE format
        expected_data = json.dumps({'text': 'Hello there!'})
        self.assertIn(f"data: {expected_data}\n\n", content)
        self.assertIn("data: [DONE]\n\n", content)

    @patch('chatbot.views.client')
    def test_chat_message_api_error(self, mock_client):
        """Test handling of API errors."""
        mock_client.chats.create.side_effect = Exception("API Error")

        response = self.client.post(
            self.url,
            data=json.dumps({'message': 'Hello'}),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        content = b"".join(response.streaming_content).decode('utf-8')

        # Check that the error is sent back in the stream
        expected_error = json.dumps({'error': 'API Error'})
        self.assertIn(f"data: {expected_error}\n\n", content)
