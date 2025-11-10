output "app_url_frontend" {
  description = "URL to access the frontend"
  value       = "http://${digitalocean_droplet.app.ipv4_address}:3000"
}

output "app_url_backend" {
  description = "URL to access the backend API"
  value       = "http://${digitalocean_droplet.app.ipv4_address}:4000"
}
