variable "do_token" {
  description = "DigitalOcean API token"
  type        = string
  sensitive   = true
}

variable "ssh_key_name" {
  description = "Name of existing SSH key in DigitalOcean account to attach to droplet"
  type        = string
}

variable "region" {
  description = "DigitalOcean region slug (e.g., nyc3, fra1)"
  type        = string
  default     = "nyc3"
}

variable "droplet_size" {
  description = "Droplet size slug"
  type        = string
  default     = "s-1vcpu-1gb"
}

variable "image" {
  description = "Base image for droplet"
  type        = string
  default     = "ubuntu-22-04-x64"
}

variable "project_name" {
  description = "Name used for resources"
  type        = string
  default     = "task-manager"
}

variable "repo_url" {
  description = "Git repository URL to clone"
  type        = string
  default     = "https://github.com/chanaka-devx/task-manager.git"
}

variable "repo_branch" {
  description = "Git branch to checkout"
  type        = string
  default     = "main"
}

variable "compose_file" {
  description = "Relative path to docker-compose file inside repo"
  type        = string
  default     = "docker-compose.yml"
}

variable "allowed_inbound_ports" {
  description = "List of TCP ports to open to the world"
  type        = list(string)
  default     = ["22", "3000", "4000"]
}
