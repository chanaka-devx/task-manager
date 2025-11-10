terraform {
  required_version = ">= 1.5.0"
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = ">= 2.38.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}

locals {
  vm_name  = var.project_name
  repo_dir = "/opt/task-manager"
}

data "digitalocean_ssh_key" "default" {
  name = var.ssh_key_name
}

resource "digitalocean_droplet" "app" {
  name   = local.vm_name
  region = var.region
  size   = var.droplet_size
  image  = var.image

  ssh_keys = [data.digitalocean_ssh_key.default.id]

  monitoring = true

  user_data = templatefile("${path.module}/cloud-init.tpl", {
    repo_url     = var.repo_url
    repo_branch  = var.repo_branch
    repo_dir     = local.repo_dir
    compose_file = var.compose_file
  })
  lifecycle {
    ignore_changes = [user_data]
  }
}

resource "digitalocean_firewall" "app_fw" {
  name = "${local.vm_name}-fw"

  droplet_ids = [digitalocean_droplet.app.id]

  # Allow inbound on commonly used app ports
  dynamic "inbound_rule" {
    for_each = var.allowed_inbound_ports
    content {
      protocol         = "tcp"
      port_range       = inbound_rule.value
      source_addresses = ["0.0.0.0/0", "::/0"]
    }
  }

  # Allow all outbound
  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}

output "droplet_ip" {
  description = "Public IPv4 address of the app droplet"
  value       = digitalocean_droplet.app.ipv4_address
}
