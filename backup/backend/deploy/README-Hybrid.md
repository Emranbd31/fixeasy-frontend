# Hybrid Backend Deploy via Webhook

## 1. Install Flask
```
pip install flask
```

## 2. Set up GitHub Webhook
- Go to your GitHub repo → Settings → Webhooks
- Payload URL: `https://your-server:8443/github-webhook`
- Content type: `application/json`
- Secret: (set to your `GITHUB_WEBHOOK_SECRET`)
- Select events: `Just the push event`

## 3. Run webhook.py
```
nohup python3 webhook.py &
```

## 4. Make deploy.sh executable
```
chmod +x /srv/backend/deploy.sh
```

## 5. Test automatic deploy
- Push to main branch
- GitHub will POST to your server
- If signature is valid, backend will auto-update
