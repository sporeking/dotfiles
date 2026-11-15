import importlib.util
import unittest
from pathlib import Path
spec = importlib.util.spec_from_file_location('bridge', Path(__file__).parents[1] / 'src/query.py')
bridge = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bridge)

class BackendTests(unittest.TestCase):
    def test_redaction_nested_config_logs(self):
        value = bridge.clean({'api_key': 'hidden', 'config': {'token': 'abc'}, 'log': 'SWANLAB_API_KEY=known-secret Bearer abc.def', 'value': float('nan')}, 'known-secret')
        self.assertEqual(value['api_key'], '[redacted]')
        self.assertEqual(value['config']['token'], '[redacted]')
        self.assertNotIn('known-secret', str(value))
        self.assertNotIn('abc.def', str(value))
        self.assertIsNone(value['value'])

    def test_input_restrictions(self):
        for request in [{'action':'delete'}, {'action':'projects','host':'http://evil'}, {'action':'run','project':'a/../b','run':'a'}, {'action':'series','project':'a/b','run':'r','key':'x','limit':1501}, {'action':'projects','limit':True}]:
            with self.assertRaises(bridge.QueryError): bridge.validate(request)

    def test_asset_validation_and_metadata(self):
        base = {'action':'asset', 'project':'a/b', 'run':'r', 'key':'analysis/full_report', 'step':1000}
        self.assertEqual(bridge.validate(base)['item'], 0)
        for extra in [{'item':-1}, {'item':2000}, {'item':True}, {'url':'http://evil'}, {'limit':1}, {'step':None}]:
            with self.assertRaises(bridge.QueryError): bridge.validate({**base, **extra})
        metadata = bridge.media_metadata({'url':'http://localhost/file.html?signature=private', 'caption':'report'}, 2)
        self.assertEqual(metadata, {'item':2, 'type':'html', 'contentType':'text/html; charset=utf-8', 'available':True, 'caption':'report'})

    def test_asset_origin_and_redirect_constraints(self):
        host = 'http://127.0.0.1:8000'
        for url in ['file:///etc/passwd', 'http://evil/x.html', 'http://127.0.0.1:9000/x.html', 'https://127.0.0.1:8000/x.html', 'http://user:pass@127.0.0.1:8000/x.html', '//127.0.0.1:8000/x.html']:
            with self.assertRaises(bridge.QueryError): bridge.trusted_asset_url(url, host)
        self.assertEqual(bridge.trusted_asset_url(host+'/file.html?signed=private', host), host+'/file.html?signed=private')

    def test_asset_download_bounds_redirects_and_bytes(self):
        from http.server import BaseHTTPRequestHandler, HTTPServer
        from threading import Thread
        class Handler(BaseHTTPRequestHandler):
            def log_message(self, *args): pass
            def do_GET(self):
                if self.path == '/redirect.html':
                    self.send_response(302); self.send_header('Location', 'http://example.invalid/leak.html'); self.end_headers(); return
                if self.path == '/local.html':
                    self.send_response(302); self.send_header('Location', '/ok.html'); self.end_headers(); return
                self.send_response(200); self.end_headers()
                try: self.wfile.write(b'x' * (bridge.MAX_ASSET_BYTES + 1) if self.path == '/big.html' else b'<html>'+b'x'*30000+b'</html>')
                except (BrokenPipeError, ConnectionResetError): pass
        server = HTTPServer(('127.0.0.1', 0), Handler)
        worker = Thread(target=server.serve_forever, daemon=True); worker.start()
        host = 'http://127.0.0.1:'+str(server.server_port)
        try:
            result = bridge.fetch_asset({'url':host+'/local.html'}, host)
            import base64
            self.assertEqual(len(base64.b64decode(result['bodyBase64'])), 30013)
            for path in ['/redirect.html', '/big.html']:
                with self.assertRaises(bridge.QueryError): bridge.fetch_asset({'url':host+path}, host)
        finally:
            server.shutdown(); server.server_close(); worker.join()

    def test_one_page_without_metadata_refetch(self):
        class Page:
            _errors = []
            _page_info = {'total': 42, 'pages': 5}
            def __iter__(self): return iter([1,2])
        data, meta = bridge.page_result(Page(), lambda x:x, {'page':1,'limit':10})
        self.assertEqual(data['items'], [1,2])
        self.assertEqual(meta['nextPage'], 2)
        self.assertTrue(meta['truncated'])

if __name__ == '__main__': unittest.main()
