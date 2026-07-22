# Running your site on your own server

A practical, copy-paste guide. It takes a fresh Linux server, serves your site at `pooyamalek.com` over HTTPS, and gives you a simple way to push updates. Written for someone who is comfortable following steps, not a sysadmin. Every command is safe to run in order.

Assumptions used in the examples. Change these to your real values as you go:
- Domain: `pooyamalek.com` (and `www.pooyamalek.com`)
- Server user you will create: `pooya`
- Server operating system: Ubuntu 24.04 LTS
- Your site files: the `site/` folder from this project

---

## The honest tradeoff first

For a static site, Vercel or Netlify would host this free, with HTTPS and deploys handled for you, in about five minutes. A VPS is more work and costs a few euro a month. You are choosing the VPS because you want your own booking and payment backend later, and that needs a server you control. Good reason. This same server will run those projects too.

If you ever change your mind and just want it live today with zero maintenance, say so and I will give you the Vercel path instead.

---

## Part 1. Create the server

1. Make an account at **Hetzner Cloud** (`console.hetzner.com`). Alternatives that work identically: DigitalOcean, Vultr, Linode.
2. Create a new project, then create a server (Hetzner calls it a "server", others call it a "droplet" or "instance"):
   - Location: Nuremberg or Falkenstein (closest to you).
   - Image: **Ubuntu 24.04**.
   - Type: the smallest shared vCPU (CX22 or similar, about 4 euro a month). Plenty for this.
   - SSH key: add one if you have it. If not, you can use a password for now and add a key later.
3. When it finishes, note the server's **public IP address**. It looks like `203.0.113.45`.

---

## Part 2. Point your domain at the server

In your domain registrar's DNS settings (wherever you bought `pooyamalek.com`), create two records:

| Type | Name | Value |
|------|------|-------|
| A | `@` | your server IP (e.g. `203.0.113.45`) |
| A | `www` | your server IP (same address) |

Save. DNS can take anywhere from a few minutes to a couple of hours to propagate. You can check progress at `dnschecker.org`.

---

## Part 3. First login and basic security

Open your terminal (Terminal on Mac). Log in as root:

```bash
ssh root@203.0.113.45
```

Update the system:

```bash
apt update && apt upgrade -y
```

Create your own user so you are not working as root, and give it admin rights:

```bash
adduser pooya
usermod -aG sudo pooya
```

Set up a firewall that only allows SSH and web traffic:

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

(If it asks, type `y`.) Now log out and back in as your new user:

```bash
exit
ssh pooya@203.0.113.45
```

From here on, commands use `sudo` for admin actions.

---

## Part 4. Install the web server (Nginx)

```bash
sudo apt install nginx -y
```

Visit `http://203.0.113.45` in a browser. You should see the default "Welcome to nginx" page. That confirms the server is serving web traffic.

---

## Part 5. Put your site on the server

Create a folder for your site:

```bash
sudo mkdir -p /var/www/pooyamalek.com
sudo chown -R pooya:pooya /var/www/pooyamalek.com
```

Now upload your files. Do this **from your own computer**, in a new terminal tab (not logged into the server). Go to where your `site/` folder is, then:

```bash
rsync -av --delete ./site/ pooya@203.0.113.45:/var/www/pooyamalek.com/
```

`rsync` copies everything and, with `--delete`, keeps the server an exact mirror of your local folder. This same one line is how you will push every future update.

---

## Part 6. Tell Nginx about your site

Create a config file:

```bash
sudo nano /etc/nginx/sites-available/pooyamalek.com
```

Paste this in (Nano: paste, then Ctrl+O, Enter, Ctrl+X to save and exit):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name pooyamalek.com www.pooyamalek.com;

    root /var/www/pooyamalek.com;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    # Cache static assets for a year
    location ~* \.(css|js|jpg|jpeg|png|svg|webp|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Compress text assets
    gzip on;
    gzip_types text/css application/javascript image/svg+xml;
}
```

Enable the site, test the config, and reload:

```bash
sudo ln -s /etc/nginx/sites-available/pooyamalek.com /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Once DNS has propagated, `http://pooyamalek.com` now shows your site.

---

## Part 7. Turn on HTTPS (free, automatic)

Install Certbot and get a certificate from Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d pooyamalek.com -d www.pooyamalek.com
```

Answer the prompts (enter your email, agree to terms). When it asks about redirecting HTTP to HTTPS, choose **yes**. Certbot edits your Nginx config for you and reloads.

Your site is now live at `https://pooyamalek.com` with a padlock. Certificates renew automatically; you can confirm the renewal timer with `sudo systemctl status certbot.timer`.

---

## Part 8. Redirect www to the bare domain (optional but tidy)

You added `<link rel="canonical" href="https://www.pooyamalek.com/">` in your files, so pick one version as canonical and be consistent. If you prefer `www` as the main address, that is fine and Certbot already covers both. If you prefer the bare `pooyamalek.com`, edit the config to redirect www to it, or vice versa. Tell me which you want and I will hand you the exact block. Consistency matters more than which one you pick.

---

## Part 9. How you deploy updates from now on

Whenever you change the site locally, run this one line from your computer:

```bash
rsync -av --delete ./site/ pooya@203.0.113.45:/var/www/pooyamalek.com/
```

That is the whole deploy. No downtime, live in seconds.

To make it even easier, save it as a script. On your computer, create `deploy.sh` next to the `site/` folder:

```bash
#!/usr/bin/env bash
rsync -av --delete ./site/ pooya@203.0.113.45:/var/www/pooyamalek.com/
echo "Deployed to pooyamalek.com"
```

Make it runnable once (`chmod +x deploy.sh`), then just run `./deploy.sh` each time.

---

## Part 10. Running more projects on the same server

This is why you chose a VPS. To add another site or app later:

- **Another static site**: repeat Parts 5 to 7 with a new folder and a new Nginx config file for its domain.
- **A backend app** (your future booking and payment service, e.g. Node): run it on a local port like `3000`, then add an Nginx config that proxies its domain to that port:

```nginx
server {
    server_name booking.pooyamalek.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $remote_addr;
    }
}
```

Then run `sudo certbot --nginx -d booking.pooyamalek.com` for HTTPS. Use a process manager like **pm2** so the app restarts on crash and reboot. When you get to that stage, I will walk you through it properly.

---

## Part 11. Keep it healthy

- **Automatic security updates**: `sudo apt install unattended-upgrades -y` then `sudo dpkg-reconfigure --priority=low unattended-upgrades`.
- **Backups**: enable Hetzner's automated backups (a small monthly add-on) so you can restore the whole server if needed. Your site files also live on your own computer, so the site itself is never at risk.
- **Uptime alerts**: a free monitor like UptimeRobot emails you if the site goes down.
- **Logs if something breaks**: `sudo tail -f /var/log/nginx/error.log`.

---

## Simpler alternative: Docker + Caddy

If you would rather not manage Nginx and Certbot by hand, **Caddy** serves static files and handles HTTPS automatically with almost no config. A minimal `Caddyfile` is literally:

```
pooyamalek.com, www.pooyamalek.com {
    root * /var/www/pooyamalek.com
    file_server
    encode gzip
}
```

Caddy fetches and renews the certificate on its own. If you want, I can give you a full Docker Compose setup that runs Caddy and your site in containers, which makes moving to a new server later trivial. Say the word.

---

## Home server note

You can run all of this on a machine at home (an old laptop, a Raspberry Pi) instead of a cloud VPS. The steps are identical from Part 3 onward. The catch is that home internet usually gives you a changing IP address and blocks some traffic, so you would need dynamic DNS and to open ports on your router. For a public professional site, a cloud VPS is the calmer choice. Keep the home server idea for tinkering.

---

## Quick reference

| Task | Command |
|------|---------|
| Log in | `ssh pooya@YOUR_IP` |
| Deploy update | `rsync -av --delete ./site/ pooya@YOUR_IP:/var/www/pooyamalek.com/` |
| Test Nginx config | `sudo nginx -t` |
| Reload Nginx | `sudo systemctl reload nginx` |
| Renew certificate (manual check) | `sudo certbot renew --dry-run` |
| View errors | `sudo tail -f /var/log/nginx/error.log` |

If you tell me your provider and whether you want `www` or the bare domain as canonical, I will tighten this into an exact, no-decisions checklist for your specific setup.
