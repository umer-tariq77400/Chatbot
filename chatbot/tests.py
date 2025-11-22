from django.test import TestCase, Client
import json


class DummyChunkText:
	def __init__(self, text):
		self.text = text


class DummyChunkDelta:
	def __init__(self, delta):
		self.delta = delta


class DummyMessage:
	def __init__(self, content):
		self.content = content


class DummyChunkMessage:
	def __init__(self, message):
		self.message = message


class ChatStreamingTests(TestCase):
	def setUp(self):
		self.client = Client()

	def test_streaming_handles_various_chunk_shapes(self, monkeypatch=None):
		# Create a fake client whose chat.create().send_message_stream yields
		# different shaped chunks
		chunks = [
			DummyChunkText('Hello'),
			DummyChunkDelta({'content': ' world'}),
			DummyChunkMessage(DummyMessage('!')),
		]

		class FakeChatObj:
			def __init__(self, chunks):
				self._chunks = chunks

			def send_message_stream(self, message):
				for c in self._chunks:
					yield c

		class FakeChats:
			def __init__(self, chunks):
				self._chunks = chunks

			def create(self, model=None, config=None):
				return FakeChatObj(self._chunks)

		class FakeClient:
			def __init__(self, chunks):
				self.chats = FakeChats(chunks)

		# monkeypatch the client used by the view
		import chatbot.views as views
		views.client = FakeClient(chunks)

		resp = self.client.post('/api/chat/message/', json.dumps({'message': 'hi'}), content_type='application/json')

		# Streaming content is an iterable of bytes; join them
		content = b''.join(list(resp.streaming_content))
		text = content.decode('utf-8')

		# Expect that the SSE data events included the concatenated text 'Hello world!'
		self.assertIn('Hello', text)
		self.assertIn('world', text)
		self.assertIn('!', text)

	def test_missing_api_key_produces_error_text(self):
		# Ensure that if client is None (no API key) we get an error text chunk
		import chatbot.views as views
		views.client = None

		resp = self.client.post('/api/chat/message/', json.dumps({'message': 'hi'}), content_type='application/json')
		content = b''.join(list(resp.streaming_content))
		text = content.decode('utf-8')

		# We expect a friendly configuration message instead of an AttributeError
		self.assertIn('Server configuration error: API_KEY not set on server', text)
		self.assertIn('[DONE]', text)

	def test_load_dotenv_sets_env_var(self):
		# Verify we can load a .env file and make API_KEY visible via os.environ
		from dotenv import load_dotenv
		import os
		import tempfile

		# Create a temp env file and load it
		tmp = tempfile.NamedTemporaryFile('w', delete=False)
		try:
			tmp.write('API_KEY=test-dotenv-key-xyz')
			tmp.flush()
			tmp.close()

			# Ensure it's not present already
			old = os.environ.pop('API_KEY', None)

			try:
				load_dotenv(tmp.name)
				self.assertEqual(os.environ.get('API_KEY'), 'test-dotenv-key-xyz')
			finally:
				# restore previous env var (if any) so tests don't leak
				if old is not None:
					os.environ['API_KEY'] = old
		finally:
			try:
				import os as _os
				_os.unlink(tmp.name)
			except Exception:
				pass
