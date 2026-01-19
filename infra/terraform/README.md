# Terraform Deployment to DigitalOcean

This directory provisions a single Ubuntu droplet on DigitalOcean, installs Docker & Docker Compose via cloud-init, clones the repository, and launches the stack with `docker compose`.

## Files
- `main.tf` – Provider, droplet, firewall resources
- `variables.tf` – Input variables you can customize
- `outputs.tf` – Helpful output URLs
- `cloud-init.tpl` – Cloud-init template used as `user_data` to bootstrap the server
- `terraform.tfvars.example` – Example variable values (copy to `terraform.tfvars`)

## Prerequisites
1. DigitalOcean account & API token (with write permissions)
2. An SSH public key already added in DigitalOcean (Settings -> Security)
3. Terraform >= 1.5 installed locally

## Quick Start
```powershell
cd infra/terraform
Copy-Item terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars to add your real token & SSH key name
terraform init
terraform plan
terraform apply -auto-approve
```

After apply, Terraform will output the droplet IP. Access:
- Frontend: `http://<ip>:3000`
- Backend: `http://<ip>:4000`

## Customization
| Variable | Purpose |
|----------|---------|
| `droplet_size` | Change CPU/RAM (e.g. `s-1vcpu-2gb`) |
| `region` | Deploy region slug (`nyc3`, `fra1`, etc.) |
| `compose_file` | If your compose file path differs |
| `allowed_inbound_ports` | Open additional ports (e.g. add `80` for HTTP) |

### Repository access
By default `repo_url` should be a public HTTPS URL. If your repo is private, consider one of these options:
- Push your images to a registry (Docker Hub or DigitalOcean Container Registry) and change `docker-compose.yml` to pull images instead of building.
- Use an SSH Git URL and add a read-only deploy key to the droplet via cloud-init; this requires extending `cloud-init.tpl` to place a private key under `/root/.ssh` and trust GitHub.

## Production Hardening Suggestions
1. Reverse proxy with Nginx + HTTPS (Let's Encrypt) – open port 80/443 and terminate TLS there.
2. Remove MongoDB public port mapping (avoid exposing port 27017). Internally containers can talk using the Docker network.
3. Use a managed MongoDB database (`digitalocean_database_cluster`) instead of a container to get automated backups & scaling.
4. Externalize secrets (`JWT_SECRET`, DB credentials) using environment variables or DO Secrets; avoid hardcoding in `docker-compose.yml`.
5. Add a DigitalOcean firewall rule restricting SSH to your IP only.

## Updating the App
SSH into the droplet:
```powershell
ssh root@<droplet_ip>
cd /opt/task-manager
git pull
docker compose up -d --build
```

## Destroy
```powershell
terraform destroy -auto-approve
```

## Next Steps / CI Integration
In Jenkins, add a stage that runs Terraform with environment variables for the DigitalOcean token. Cache the `.terraform` directory for faster applies. Use `terraform plan -out plan.tfplan` followed by manual approval and `terraform apply plan.tfplan` for safer deployments.

---
This setup is intentionally minimal; expand as needed for scaling, monitoring, and security.
