import os
import requests
from escherauth.escherauth import EscherRequestsAuth
from urllib.parse import urlparse

class EscherAuthRequestWrapper(object):
    def __init__(self, scope, options, escher_client):
        self._e = EscherRequestsAuth(scope, options, escher_client)

    def __call__(self, r):
        parsed_uri = urlparse(r.url)
        r.headers['Host'] = parsed_uri.netloc

        apisec_req = r.copy()
        apisec_req.url = '/api/serviceMe'
        apisec_req.method = 'GET'
        apisec_req.body = None
        apisec_signed_req = self._e(apisec_req)

        r.headers['APISEC-AUTH'] = 'escher'
        r.headers['X-Escher-Auth'] = apisec_signed_req.headers['X-Escher-Auth']
        r.headers['X-Escher-Date'] = apisec_signed_req.headers['X-Escher-Date']

        return r

class EscherAuthPlugin(requests.auth.AuthBase):
    name = 'Escher auth'
    auth_type = 'apisec_escher'
    description = 'Set the right format for Escher auth request'
    auth_require = False
    prompt_password = False

    def __init__(self, access_key, secret_key):
        self.access_key = access_key
        self.secret_key = secret_key

    def __call__(self, r):
        auth = self.get_auth(self.access_key, self.secret_key)
        return auth(r)

    def get_auth(self, access_key, secret_key):
        username = 'global/services/portshift_request/' + access_key
        password = secret_key

        if "/" in username:
            scope = username.split("/")
            escher_key = scope.pop()
            scope = "/".join(scope)

        escher_client = {'api_key': escher_key, 'api_secret': password}

        options = {}
        return EscherAuthRequestWrapper(scope, options, escher_client)