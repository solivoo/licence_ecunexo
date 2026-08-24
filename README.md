# license_ecunexo

Plataforma de licenciamiento EcuNexo: API de emisión (`ecunexo_license_api`) y panel de operadores (`ecunexo_license`).

Host y base de datos separados del producto cliente. Versión: `VERSION` / tag `v1.0.0`.

```
ecunexo_license_api/   # API .NET — 5090, BD licensing_ecunexo
ecunexo_license/       # SPA operadores (Vite / Nginx)
nuget-local/           # Feed local EcuNexo.Core
deploy/                # Docker Compose + Portainer
```

## Contributors

- [solivoo](https://github.com/solivoo) — Sergio Olivo

## Portainer / Docker

1. En el host: `mkdir -p /opt/ecunexo/licencias/keys` y genera la RSA:
   `openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out /opt/ecunexo/licencias/keys/license-private.pem`
   `openssl rsa -in .../license-private.pem -pubout -out .../license-public.pem`
2. Copia `deploy/.env.example` → `.env` (o Env de Portainer) y rellena peppers / JWT / passwords.
3. Stack Compose: archivo **`docker-compose.yml`** en la raíz (default Portainer). Alternativa: `deploy/docker-compose.yml`.
4. Variables críticas: `ISSUE_PEPPER`, `VALIDATION_PEPPER`, `JWT_SIGNING_KEY`, `PROVISIONING_ENCRYPTION_KEY`, `LICENSE_KEYS_HOST_PATH`, `VITE_API_BASE_URL`, `CORS_ALLOWED_ORIGINS`.
5. La clave **pública** y el `VALIDATION_PEPPER` van al producto Cliente (no a este stack).
