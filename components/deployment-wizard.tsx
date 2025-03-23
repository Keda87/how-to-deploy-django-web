"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type Step = {
  id: string
  title: string
  content: React.ReactNode
  nextStep?: (answer: string) => string
}

export function DeploymentWizard() {
  const [currentStepId, setCurrentStepId] = useState<string>("wsgi")
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentAnswer, setCurrentAnswer] = useState<string>("")

  const steps: Record<string, Step> = {
    wsgi: {
      id: "wsgi",
      title: "WSGI Server",
      content: (
        <div className="space-y-4">
          <p className="text-lg">Apakah sudah punya WSGI server?</p>
          <p className="text-sm text-muted-foreground">(Do you already have a WSGI server?)</p>
          <RadioGroup value={currentAnswer} onValueChange={setCurrentAnswer}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="wsgi-yes" />
              <Label htmlFor="wsgi-yes">Ya (Yes)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="wsgi-no" />
              <Label htmlFor="wsgi-no">Tidak (No)</Label>
            </div>
          </RadioGroup>
        </div>
      ),
      nextStep: (answer) => (answer === "yes" ? "reverse-proxy" : "setup-wsgi"),
    },
    "setup-wsgi": {
      id: "setup-wsgi",
      title: "Set Up WSGI Server",
      content: (
        <div className="space-y-4">
          <p>
            A WSGI (Web Server Gateway Interface) server is needed to deploy Django applications in production. Here are
            some popular options:
          </p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="gunicorn">
              <AccordionTrigger className="text-lg font-medium">Gunicorn</AccordionTrigger>
              <AccordionContent>
                <div className="p-4 space-y-4">
                  <p>A Python WSGI HTTP Server for UNIX. It's lightweight and widely used with Django.</p>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="font-medium">Installation:</p>
                    <pre className="mt-2 p-2 bg-background rounded text-sm overflow-x-auto">
                      <code>pip install gunicorn</code>
                    </pre>
                  </div>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="font-medium">Example Gunicorn Configuration:</p>
                    <pre className="mt-2 p-2 bg-background rounded text-sm overflow-x-auto">
                      <code>{`# Install Gunicorn
pip install gunicorn

# Add to requirements.txt
echo "gunicorn" >> requirements.txt

# Run with Gunicorn (in production)
gunicorn myproject.wsgi:application --bind 0.0.0.0:8000`}</code>
                    </pre>
                  </div>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="font-medium">Create a systemd service file:</p>
                    <pre className="mt-2 p-2 bg-background rounded text-sm overflow-x-auto">
                      <code>{`# /etc/systemd/system/gunicorn.service
[Unit]
Description=gunicorn daemon
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/your/project
ExecStart=/path/to/your/venv/bin/gunicorn --workers 3 --bind 0.0.0.0:8000 myproject.wsgi:application

[Install]
WantedBy=multi-user.target`}</code>
                    </pre>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="uwsgi">
              <AccordionTrigger className="text-lg font-medium">uWSGI</AccordionTrigger>
              <AccordionContent>
                <div className="p-4 space-y-4">
                  <p>A fast, self-healing and developer/sysadmin-friendly application container server.</p>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="font-medium">Installation:</p>
                    <pre className="mt-2 p-2 bg-background rounded text-sm overflow-x-auto">
                      <code>pip install uwsgi</code>
                    </pre>
                  </div>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="font-medium">Example uWSGI Configuration (uwsgi.ini):</p>
                    <pre className="mt-2 p-2 bg-background rounded text-sm overflow-x-auto">
                      <code>{`[uwsgi]
project = myproject
base = /path/to/your/project

chdir = %(base)
module = %(project).wsgi:application

master = true
processes = 5

socket = %(base)/%(project).sock
chmod-socket = 664
vacuum = true

die-on-term = true`}</code>
                    </pre>
                  </div>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="font-medium">Create a systemd service file:</p>
                    <pre className="mt-2 p-2 bg-background rounded text-sm overflow-x-auto">
                      <code>{`# /etc/systemd/system/uwsgi.service
[Unit]
Description=uWSGI Emperor service
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/your/project
ExecStart=/path/to/your/venv/bin/uwsgi --ini uwsgi.ini

[Install]
WantedBy=multi-user.target`}</code>
                    </pre>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="granian">
              <AccordionTrigger className="text-lg font-medium">Granian</AccordionTrigger>
              <AccordionContent>
                <div className="p-4 space-y-4">
                  <p>
                    Granian is a Rust-based Python WSGI/ASGI HTTP server known for its high performance and low resource
                    usage. It's a modern alternative to Gunicorn and uWSGI with impressive benchmarks.
                  </p>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="font-medium">Installation:</p>
                    <pre className="mt-2 p-2 bg-background rounded text-sm overflow-x-auto">
                      <code>pip install granian</code>
                    </pre>
                  </div>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="font-medium">Basic Usage for Django (WSGI):</p>
                    <pre className="mt-2 p-2 bg-background rounded text-sm overflow-x-auto">
                      <code>{`# Run with Granian
granian --interface wsgi --host 0.0.0.0 --port 8000 --workers 4 myproject.wsgi:application`}</code>
                    </pre>
                  </div>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="font-medium">Advanced Configuration:</p>
                    <pre className="mt-2 p-2 bg-background rounded text-sm overflow-x-auto">
                      <code>{`# Run with more options
granian --interface wsgi \\
  --host 0.0.0.0 \\
  --port 8000 \\
  --workers 4 \\
  --threads 8 \\
  --backlog 2048 \\
  --http-max-request-size 1048576 \\
  myproject.wsgi:application`}</code>
                    </pre>
                  </div>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="font-medium">Create a systemd service file:</p>
                    <pre className="mt-2 p-2 bg-background rounded text-sm overflow-x-auto">
                      <code>{`# /etc/systemd/system/granian.service
[Unit]
Description=Granian server for Django
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/your/project
ExecStart=/path/to/your/venv/bin/granian --interface wsgi --host 0.0.0.0 --port 8000 --workers 4 myproject.wsgi:application

[Install]
WantedBy=multi-user.target`}</code>
                    </pre>
                  </div>
                  <div className="mt-4">
                    <p className="font-medium">Key Features:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Written in Rust for high performance</li>
                      <li>Supports both WSGI and ASGI</li>
                      <li>Low memory footprint</li>
                      <li>Configurable worker and thread counts</li>
                      <li>HTTP/1, HTTP/2, and HTTP/3 support</li>
                      <li>TLS/SSL support</li>
                    </ul>
                  </div>
                  <div className="mt-4">
                    <Link
                      href="https://github.com/emmett-framework/granian"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Granian GitHub Repository
                    </Link>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ),
      nextStep: () => "reverse-proxy",
    },
    "reverse-proxy": {
      id: "reverse-proxy",
      title: "Reverse Proxy Configuration",
      content: (
        <div className="space-y-4">
          <p>
            A reverse proxy sits in front of your Django application to handle client requests, serve static files, and
            provide additional features like SSL termination and load balancing.
          </p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="nginx">
              <AccordionTrigger className="text-lg font-medium">Nginx Configuration</AccordionTrigger>
              <AccordionContent>
                <div className="p-4 space-y-4">
                  <p>
                    Nginx is a popular, high-performance web server and reverse proxy. Here's how to configure it for
                    your Django application:
                  </p>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="font-medium">Basic Nginx Configuration with Static Files:</p>
                    <pre className="mt-2 p-2 bg-background rounded text-sm overflow-x-auto">
                      <code>{`# /etc/nginx/sites-available/myproject

server {
    listen 80;
    server_name example.com www.example.com;

    # Static files
    location /static/ {
        alias /path/to/your/project/staticfiles/;
        expires 30d;
        access_log off;
        add_header Cache-Control "public, max-age=2592000";
    }

    # Media files
    location /media/ {
        alias /path/to/your/project/media/;
        expires 30d;
        access_log off;
        add_header Cache-Control "public, max-age=2592000";
    }

    # Proxy pass to Django application
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`}</code>
                    </pre>
                  </div>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="font-medium">Nginx with SSL Configuration:</p>
                    <pre className="mt-2 p-2 bg-background rounded text-sm overflow-x-auto">
                      <code>{`# /etc/nginx/sites-available/myproject

server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name example.com www.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # Static files
    location /static/ {
        alias /path/to/your/project/staticfiles/;
        expires 30d;
        access_log off;
        add_header Cache-Control "public, max-age=2592000";
    }

    # Media files
    location /media/ {
        alias /path/to/your/project/media/;
        expires 30d;
        access_log off;
        add_header Cache-Control "public, max-age=2592000";
    }

    # Proxy pass to Django application
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`}</code>
                    </pre>
                  </div>
                  <p>After creating this configuration, enable it and restart Nginx:</p>
                  <pre className="mt-2 p-2 bg-muted rounded text-sm overflow-x-auto">
                    <code>{`sudo ln -s /etc/nginx/sites-available/myproject /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx`}</code>
                  </pre>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="caddy">
              <AccordionTrigger className="text-lg font-medium">Caddy Configuration</AccordionTrigger>
              <AccordionContent>
                <div className="p-4 space-y-4">
                  <p>
                    Caddy is a modern, easy-to-configure web server with automatic HTTPS. Here's how to set it up for
                    Django:
                  </p>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="font-medium">Basic Caddy Configuration:</p>
                    <pre className="mt-2 p-2 bg-background rounded text-sm overflow-x-auto">
                      <code>{`# Caddyfile

example.com {
    # Automatic HTTPS
    
    # Static files
    handle /static/* {
        root * /path/to/your/project/staticfiles
        file_server {
            precompressed br gzip
        }
        header Cache-Control "public, max-age=2592000"
    }
    
    # Media files
    handle /media/* {
        root * /path/to/your/project/media
        file_server
        header Cache-Control "public, max-age=2592000"
    }
    
    # Reverse proxy to Django application
    handle {
        reverse_proxy localhost:8000
    }
}`}</code>
                    </pre>
                  </div>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="font-medium">Advanced Caddy Configuration:</p>
                    <pre className="mt-2 p-2 bg-background rounded text-sm overflow-x-auto">
                      <code>{`# Caddyfile

example.com {
    # Logging
    log {
        output file /var/log/caddy/access.log
        format json
    }
    
    # Compression
    encode gzip zstd
    
    # Security headers
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
    
    # Static files
    handle /static/* {
        root * /path/to/your/project/staticfiles
        file_server {
            precompressed br gzip
        }
        header Cache-Control "public, max-age=2592000"
    }
    
    # Media files
    handle /media/* {
        root * /path/to/your/project/media
        file_server
        header Cache-Control "public, max-age=2592000"
    }
    
    # Reverse proxy to Django application
    handle {
        reverse_proxy localhost:8000 {
            header_up X-Forwarded-Proto {scheme}
            header_up X-Forwarded-For {remote}
            header_up Host {host}
        }
    }
}`}</code>
                    </pre>
                  </div>
                  <p>Start Caddy with your configuration:</p>
                  <pre className="mt-2 p-2 bg-muted rounded text-sm overflow-x-auto">
                    <code>{`# Install Caddy (Ubuntu/Debian)
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy

# Start Caddy
sudo systemctl enable caddy
sudo systemctl start caddy`}</code>
                  </pre>
                  <p>Caddy automatically obtains and renews SSL certificates from Let's Encrypt.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ),
      nextStep: () => "static-files",
    },
    "static-files": {
      id: "static-files",
      title: "Static Files",
      content: (
        <div className="space-y-4">
          <p>Django needs to serve static files in production. You'll need to configure static files properly:</p>
          <div className="mt-4 p-4 bg-muted rounded-md">
            <p className="font-medium">Static Files Configuration:</p>
            <pre className="mt-2 p-2 bg-background rounded text-sm overflow-x-auto">
              <code>{`# settings.py
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Collect static files
python manage.py collectstatic`}</code>
            </pre>
          </div>
          <p>
            Your static files will be served by your reverse proxy (Nginx or Caddy) as configured in the previous step.
          </p>
        </div>
      ),
      nextStep: () => "deployment",
    },
    deployment: {
      id: "deployment",
      title: "Deployment Options",
      content: (
        <div className="space-y-4">
          <p>You can deploy your Django application to various platforms:</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-secondary/20">
              <CardHeader className="bg-secondary/10 rounded-t-lg">
                <CardTitle>VPS/Dedicated Server</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm">
                  Deploy your Django application on a Virtual Private Server (VPS) or dedicated server using the WSGI
                  server and reverse proxy configuration you've set up.
                </p>
              </CardContent>
              <CardFooter>
                <Link
                  href="https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-20-04"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:underline flex items-center"
                >
                  <span>Learn more</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </CardFooter>
            </Card>
            <Card className="border-secondary/20">
              <CardHeader className="bg-secondary/10 rounded-t-lg">
                <CardTitle>Railway</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm">Railway provides an easy way to deploy Django applications with PostgreSQL.</p>
              </CardContent>
              <CardFooter>
                <Link
                  href="https://railway.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:underline flex items-center"
                >
                  <span>Learn more</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      ),
      nextStep: () => "complete",
    },
    complete: {
      id: "complete",
      title: "Deployment Complete",
      content: (
        <div className="space-y-4 text-center">
          <div className="py-6">
            <div className="h-16 w-16 rounded-full bg-secondary/20 text-secondary mx-auto flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-medium">Your Django deployment is ready!</h3>
          <p>
            You've completed all the necessary steps to deploy your Django application. Remember to check your
            application's security settings and set up proper monitoring.
          </p>
          <div className="pt-4">
            <Button onClick={() => resetWizard()} className="bg-secondary hover:bg-secondary/90">
              Start Over
            </Button>
          </div>
        </div>
      ),
    },
  }

  const currentStep = steps[currentStepId]

  const handleNext = () => {
    if (currentStep.nextStep) {
      // If no answer is selected but we need one, use a default
      let answer = currentAnswer
      if (!answer) {
        // For steps that require a yes/no answer, default to "yes"
        if (currentStepId === "project" || currentStepId === "wsgi") {
          answer = "yes"
        } else {
          // For other steps, use "continue" as a default
          answer = "continue"
        }
      }

      const nextStepId = currentStep.nextStep(answer)
      setAnswers({ ...answers, [currentStepId]: answer })
      setCurrentStepId(nextStepId)
      setCurrentAnswer("")
    }
  }

  const handleBack = () => {
    const stepIds = Object.keys(steps)
    const currentIndex = stepIds.indexOf(currentStepId)
    if (currentIndex > 0) {
      const prevStepId = stepIds[currentIndex - 1]
      setCurrentStepId(prevStepId)
      setCurrentAnswer(answers[prevStepId] || "")
    }
  }

  const resetWizard = () => {
    setCurrentStepId("wsgi")
    setAnswers({})
    setCurrentAnswer("")
  }

  // Calculate progress percentage
  const stepIds = Object.keys(steps)
  const currentIndex = stepIds.indexOf(currentStepId)
  const progress = Math.round((currentIndex / (stepIds.length - 1)) * 100)

  return (
    <Card className="w-full max-w-3xl mx-auto border-secondary/20 shadow-lg">
      <CardHeader className="border-b border-border/30">
        <div className="flex justify-between items-center">
          <CardTitle>{currentStep.title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            Step {currentIndex + 1} of {stepIds.length}
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-2 mt-2">
          <div
            className="bg-secondary h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">{currentStep.content}</CardContent>
      <CardFooter className="flex justify-between border-t border-border/30 pt-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStepId === "wsgi"}
          className="flex items-center border-secondary/30 hover:bg-secondary/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        {currentStep.nextStep && (
          <Button onClick={handleNext} className="flex items-center bg-secondary hover:bg-secondary/90">
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

