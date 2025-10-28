import os
import hmac
import hashlib
from flask import Flask, request, abort
import subprocess

app = Flask(__name__)
GITHUB_SECRET = os.environ.get('GITHUB_WEBHOOK_SECRET', 'changeme')
DEPLOY_SCRIPT = '/srv/backend/deploy.sh'

@app.route('/github-webhook', methods=['POST'])
def github_webhook():
    signature = request.headers.get('X-Hub-Signature-256')
    if signature is None:
        abort(400, 'Missing signature header')
    sha_name, signature = signature.split('=')
    if sha_name != 'sha256':
        abort(400, 'Only sha256 is supported')
    mac = hmac.new(GITHUB_SECRET.encode(), msg=request.data, digestmod=hashlib.sha256)
    if not hmac.compare_digest(mac.hexdigest(), signature):
        abort(400, 'Invalid signature')
    # Run deploy script
    try:
        subprocess.check_call([DEPLOY_SCRIPT])
    except Exception as e:
        abort(500, f'Deploy failed: {e}')
    return 'Deployed', 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8443)
