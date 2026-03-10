# 🚀 Guide Déploiement AWS - Atlas-webapp

**Status:** ✅ GitHub Ready (Commit: ce83b42)  
**Next:** AWS Deployment Configuration

---

## 1️⃣ Avant de Déployer sur AWS

### ✅ Ce qui est déjà prêt:
- ✅ Code sécurisé (18 vulnérabilités fixées)
- ✅ Docker images prêtes (backend + frontend)
- ✅ Aucun secrets hardcodés dans le code
- ✅ `.env.production` ignoré par `.gitignore`
- ✅ Containers testés localement

### ⚠️ Ce qui doit être configuré sur AWS:

```
1. AWS Secrets Manager - Créer les secrets
2. AWS RDS - Changer le password DB
3. AWS ECS/EC2 - Déployer les containers
4. AWS ALB - Load balancer avec HTTPS
5. AWS CloudWatch - Monitoring des logs
```

---

## 2️⃣ Étape 1: Créer les Secrets dans AWS

### Via AWS Console - AWS Secrets Manager

**Créer 4 secrets:**

```
Secret 1: atlas-prod/database-password
Value: NewRandomPassword123!SecureAWS

Secret 2: atlas-prod/app-key  
Value: base64:XXXXX (généré avec php artisan key:generate)

Secret 3: atlas-prod/recaptcha-keys
Value: {
  "site_key": "6LdXXXXX...",
  "secret_key": "6LdXXXXX..."
}

Secret 4: atlas-prod/mail-password
Value: YourSMTPPassword (pour AWS SES ou Gmail)
```

### Ou via AWS CLI:

```bash
# 1. Database password
aws secretsmanager create-secret \
  --name atlas-prod/database-password \
  --secret-string "NewRandomPassword123!SecureAWS" \
  --region eu-north-1

# 2. App key (générer d'abord)
docker exec atlastech-backend php artisan key:generate --show
# Copier la clé et l'ajouter

aws secretsmanager create-secret \
  --name atlas-prod/app-key \
  --secret-string "base64:..." \
  --region eu-north-1

# 3. reCAPTCHA keys (REGENERATE depuis Google!)
aws secretsmanager create-secret \
  --name atlas-prod/recaptcha-keys \
  --secret-string '{"site_key":"6LdXXXX...","secret_key":"6LdXXXX..."}' \
  --region eu-north-1

# 4. Mail password
aws secretsmanager create-secret \
  --name atlas-prod/mail-password \
  --secret-string "YourSMTPPassword" \
  --region eu-north-1
```

---

## 3️⃣ Étape 2: Configurer AWS RDS

### ✅ Si RDS existe déjà (atlascommercial.c1u4ayqi0rzj.eu-north-1):

1. **Aller à RDS Console**
2. **Databases → Your DB Instance**
3. **Modify**
4. **Master password:** Mettre le nouveau password (atlas-prod/database-password)
5. **Apply Immediately** ✓
6. **Utiliser le même password dans AWS RDS Proxy (optionnel)**

### ✅ Si créer une nouvelle RDS:

```bash
aws rds create-db-instance \
  --db-instance-identifier atlas-prod \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --engine-version 8.0.28 \
  --master-username atlasuser \
  --master-user-password "NewRandomPassword123!SecureAWS" \
  --allocated-storage 100 \
  --storage-type gp2 \
  --publicly-accessible false \
  --db-subnet-group-name default \
  --multi-az false \
  --region eu-north-1
```

---

## 4️⃣ Étape 3: Préparer `.env.production` pour AWS

### Créer le fichier pour AWS (NE PAS COMMITTER):

```env
# Fichier: .env.production (local AWS deployment only)

APP_NAME="AtlasTech Solutions"
APP_ENV=production
APP_KEY={{SECRETS_atlas-prod/app-key}}
APP_DEBUG=false
APP_URL=https://atlascyber.viewdns.net
FRONTEND_URL=https://atlascyber.viewdns.net

# Database (RDS)
DB_CONNECTION=mysql
DB_HOST=atlas-prod.c1u4ayqi0rzj.eu-north-1.rds.amazonaws.com
DB_PORT=3306
DB_DATABASE=atlastech
DB_USERNAME=atlasuser
DB_PASSWORD={{SECRETS_atlas-prod/database-password}}

# Mail (AWS SES)
MAIL_MAILER=smtp
MAIL_HOST=email-smtp.eu-north-1.amazonaws.com
MAIL_PORT=587
MAIL_USERNAME=your-ses-username
MAIL_PASSWORD={{SECRETS_atlas-prod/mail-password}}
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@atlastech.com"

# reCAPTCHA (NOUVELLES CLÉS!)
RECAPTCHA_SITE_KEY={{SECRETS_atlas-prod/recaptcha-keys.site_key}}
RECAPTCHA_SECRET_KEY={{SECRETS_atlas-prod/recaptcha-keys.secret_key}}

# Security
SANCTUM_STATEFUL_DOMAINS=atlascyber.viewdns.net
CORS_ALLOWED_ORIGINS=https://atlascyber.viewdns.net
BCRYPT_ROUNDS=12
```

---

## 5️⃣ Étape 4: Déployer avec AWS ECS (Recommandé)

### Option A: AWS ECS Fargate (Sans serveur)

**1. Créer ECR Repositories:**
```bash
aws ecr create-repository --repository-name atlas-prod/backend --region eu-north-1
aws ecr create-repository --repository-name atlas-prod/frontend --region eu-north-1
```

**2. Pusher les images Docker:**
```bash
# Depuis la machine locale
cd /path/to/Atlas-webapp

# Backend
docker build -t atlas-prod/backend:latest ./atlastech-backend
docker tag atlas-prod/backend:latest 123456789.dkr.ecr.eu-north-1.amazonaws.com/atlas-prod/backend:latest
docker push 123456789.dkr.ecr.eu-north-1.amazonaws.com/atlas-prod/backend:latest

# Frontend
docker build -t atlas-prod/frontend:latest ./atlastech-frontend
docker tag atlas-prod/frontend:latest 123456789.dkr.ecr.eu-north-1.amazonaws.com/atlas-prod/frontend:latest
docker push 123456789.dkr.ecr.eu-north-1.amazonaws.com/atlas-prod/frontend:latest
```

**3. Créer ECS Task Definition:**
```json
{
  "family": "atlas-prod-api",
  "taskRoleArn": "arn:aws:iam::123456789:role/ecsTaskExecutionRoleAtlas",
  "executionRoleArn": "arn:aws:iam::123456789:role/ecsTaskExecutionRoleAtlas",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "123456789.dkr.ecr.eu-north-1.amazonaws.com/atlas-prod/backend:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "hostPort": 80,
          "protocol": "tcp"
        }
      ],
      "secrets": [
        {
          "name": "APP_KEY",
          "valueFrom": "arn:aws:secretsmanager:eu-north-1:123456789:secret:atlas-prod/app-key:APP_KEY::"
        },
        {
          "name": "DB_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:eu-north-1:123456789:secret:atlas-prod/database-password:DB_PASSWORD::"
        },
        {
          "name": "RECAPTCHA_SECRET_KEY",
          "valueFrom": "arn:aws:secretsmanager:eu-north-1:123456789:secret:atlas-prod/recaptcha-keys:RECAPTCHA_SECRET_KEY::"
        }
      ],
      "environment": [
        {
          "name": "APP_ENV",
          "value": "production"
        },
        {
          "name": "APP_URL",
          "value": "https://atlascyber.viewdns.net"
        },
        {
          "name": "DB_HOST",
          "value": "atlas-prod.c1u4ayqi0rzj.eu-north-1.rds.amazonaws.com"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/atlas-prod",
          "awslogs-region": "eu-north-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    },
    {
      "name": "frontend",
      "image": "123456789.dkr.ecr.eu-north-1.amazonaws.com/atlas-prod/frontend:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "hostPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "VITE_API_URL",
          "value": "https://api.atlascyber.viewdns.net"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/atlas-prod",
          "awslogs-region": "eu-north-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

**4. Créer ECS Service + Load Balancer:**
```bash
# Créer le cluster
aws ecs create-cluster --cluster-name atlas-prod --region eu-north-1

# Créer le service
aws ecs create-service \
  --cluster atlas-prod \
  --service-name api-service \
  --task-definition atlas-prod-api \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx]}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:eu-north-1:123456789:targetgroup/atlas-prod-api/xxx,containerName=backend,containerPort=80" \
  --region eu-north-1
```

---

## 6️⃣ Étape 5: Configurer ALB + HTTPS

### 1. Créer Application Load Balancer:
```bash
aws elbv2 create-load-balancer \
  --name atlas-prod-alb \
  --subnets subnet-xxx subnet-yyy \
  --security-groups sg-xxx \
  --scheme internet-facing \
  --type application \
  --region eu-north-1
```

### 2. Créer Target Groups:
```bash
# Backend target group
aws elbv2 create-target-group \
  --name atlas-prod-api \
  --protocol HTTP \
  --port 80 \
  --vpc-id vpc-xxx \
  --target-type ip \
  --health-check-enabled \
  --health-check-protocol HTTP \
  --health-check-path /api/health \
  --region eu-north-1

# Frontend target group
aws elbv2 create-target-group \
  --name atlas-prod-web \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-xxx \
  --target-type ip \
  --region eu-north-1
```

### 3. Ajouter HTTPS Listener (AWS ACM Certificate):
```bash
# Utiliser un certificat AWS ACM existant ou créer nouveau
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:eu-north-1:123456789:loadbalancer/app/atlas-prod-alb/xxx \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:eu-north-1:123456789:certificate/xxx \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:eu-north-1:123456789:targetgroup/atlas-prod-api/xxx \
  --region eu-north-1
```

### 4. Redirection HTTP → HTTPS:
```bash
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:eu-north-1:123456789:loadbalancer/app/atlas-prod-alb/xxx \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=redirect,RedirectConfig="{Protocol=HTTPS,Port=443,StatusCode=HTTP_301}" \
  --region eu-north-1
```

---

## 7️⃣ Étape 6: Monitoring avec CloudWatch

### 1. Créer CloudWatch Log Group:
```bash
aws logs create-log-group \
  --log-group-name /ecs/atlas-prod \
  --region eu-north-1
```

### 2. Configurer Alarms:
```bash
# Alarm: CPU > 80%
aws cloudwatch put-metric-alarm \
  --alarm-name atlas-prod-cpu-high \
  --alarm-description "Alert when CPU > 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:eu-north-1:123456789:atlas-alerts \
  --region eu-north-1

# Alarm: Memory > 85%
aws cloudwatch put-metric-alarm \
  --alarm-name atlas-prod-memory-high \
  --alarm-description "Alert when Memory > 85%" \
  --metric-name MemoryUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 85 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:eu-north-1:123456789:atlas-alerts \
  --region eu-north-1
```

---

## 8️⃣ Vérifier Après Déploiement

### Tests de sécurité sur AWS:

```bash
# 1. HTTPS fonctionne
❌ curl -k https://atlascyber.viewdns.net/api/auth/login
✅ Réponse: 422 Validation Error (pas erreur certificat)

# 2. Security Headers présents
❌ curl -I https://atlascyber.viewdns.net/
✅ Doit voir: 
   - X-Frame-Options: SAMEORIGIN
   - Strict-Transport-Security: max-age=31536000
   - X-Content-Type-Options: nosniff
   - Content-Security-Policy: ...

# 3. Rate limiting fonctionne
❌ for i in {1..10}; do curl -X POST https://atlascyber.viewdns.net/api/auth/login; done
✅ Doit répondre 429 Too Many Requests après limite atteinte

# 4. Pas de secrets exposes en logs
❌ aws logs tail /ecs/atlas-prod --follow
✅ Ne doit voir: passwords, keys, tokens (seulement hashes)

# 5. Vérifier env variables
❌ aws ecs describe-task-definition --task-definition atlas-prod-api
✅ Ne doit voir leurs valeurs (seulement références AWS Secrets Manager)
```

---

## 9️⃣ Checklist AWS Finale

- [ ] **AWS Secrets Manager:** 4 secrets créés (DB password, App key, reCAPTCHA keys, Mail password)
- [ ] **AWS RDS:** Mot de passe changé
- [ ] **AWS ECR:** 2 repositories créés (backend, frontend)
- [ ] **Docker Images:** Pushées à ECR
- [ ] **ECS Cluster:** Créé
- [ ] **ECS Task Definition:** Crée avec references à AWS Secrets Manager
- [ ] **ECS Service:** Déployé avec 2+ instances
- [ ] **ALB:** Créé avec HTTPS listener
- [ ] **AWS ACM Certificate:** Associé à ALB
- [ ] **CloudWatch Logs:** Groupe créé
- [ ] **CloudWatch Alarms:** CPU et Memory alarms configurés
- [ ] **DNS:** Records pointent vers ALB
- [ ] **Tests de sécurité:** HTTPS, Headers, Rate Limiting vérifiés
- [ ] **Monitoring:** CloudWatch Logs vérifiés

---

## 🔟 Après Déploiement AWS

### Monitoring Continu:

```bash
# Voir les logs
aws logs tail /ecs/atlas-prod --follow

# Voir les metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name CPUUtilization \
  --start-time 2026-03-01T00:00:00Z \
  --end-time 2026-03-09T00:00:00Z \
  --period 3600 \
  --statistics Average

# Vérifier service health
aws ecs describe-services \
  --cluster atlas-prod \
  --services api-service \
  --region eu-north-1
```

### Auto-Scaling (Optionnel):

```bash
# Ajouter auto-scaling si charge augmente
aws applicationautoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/atlas-prod/api-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10 \
  --region eu-north-1

aws applicationautoscaling put-scaling-policy \
  --policy-name atlas-prod-scaling \
  --service-namespace ecs \
  --resource-id service/atlas-prod/api-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration \
  "TargetValue=70.0,PredefinedMetricSpecification={PredefinedMetricType=ECSServiceAverageCPUUtilization}" \
  --region eu-north-1
```

---

## 📊 Coût Estimé AWS (Mensuel)

| Service | Estimation | Notes |
|---------|-----------|-------|
| **RDS MySQL (t3.micro)** | $10-15 | 1 instance, 100GB storage |
| **ECS Fargate** | $30-50 | 2 tasks × 256 CPU, 512 RAM |
| **ALB** | $16 | Load balancer + processed data |
| **CloudWatch** | $5-10 | Logs retention (7 days) |
| **NAT Gateway** | $32 | Traffic outbound |
| **Secrets Manager** | $0.40 | 4 secrets |
| **Total Estimé** | **$100-150/mois** | (Variable avec traffic) |

---

## Conclusion

✅ **Application maintenant sur GitHub**  
⏳ **Prête pour AWS (suivre les steps ci-dessus)**  
🚀 **Déploiement AWS attendu en 2-4 heures**

Questions ou problèmes lors du déploiement AWS? Consulter les logs CloudWatch!
