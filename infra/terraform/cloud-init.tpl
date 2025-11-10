#cloud-config
packages:
  - docker.io
  - git

runcmd:
  - |
    set -eux
    # Ensure docker group
    usermod -aG docker ubuntu || true
    systemctl enable --now docker

    # Install docker compose plugin if missing
    if ! command -v docker compose >/dev/null 2>&1; then
      mkdir -p /usr/libexec/docker/cli-plugins
      COMPOSE_VERSION="2.29.7"
  # Escape the compose version variable so Terraform doesn't try to interpolate it
      curl -L "https://github.com/docker/compose/releases/download/v$${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/libexec/docker/cli-plugins/docker-compose
      chmod +x /usr/libexec/docker/cli-plugins/docker-compose
    fi

    # Prepare app directory
    mkdir -p ${repo_dir}
    cd ${repo_dir}

    # Clone or update repository
    if [ ! -d .git ]; then
      git clone --branch ${repo_branch} --depth 1 ${repo_url} .
    else
      git fetch origin ${repo_branch}
      git checkout ${repo_branch}
      git reset --hard origin/${repo_branch}
    fi

    # Build and run with docker compose
    if [ -f ${compose_file} ]; then
      docker compose -f ${compose_file} up -d --build
    else
      echo "Compose file ${compose_file} not found in repo directory ${repo_dir}" >&2
    fi

    # Configure auto-start on reboot via systemd unit that calls docker compose
    cat >/etc/systemd/system/app-compose.service <<'UNIT'
    [Unit]
    Description=App Docker Compose
    Requires=docker.service
    After=docker.service

    [Service]
    Type=oneshot
    WorkingDirectory=${repo_dir}
    RemainAfterExit=yes
    ExecStart=/usr/bin/docker compose -f ${compose_file} up -d
    ExecStop=/usr/bin/docker compose -f ${compose_file} down

    [Install]
    WantedBy=multi-user.target
    UNIT

    systemctl daemon-reload
    systemctl enable app-compose
    systemctl start app-compose

final_message: "Cloud-init finished for ${repo_dir}"
