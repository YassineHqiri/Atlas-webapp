# Worker-Focused Chatbot Setup Guide

## Overview
Your AtlasTech Solutions admin dashboard now includes a **Worker Assistant** chatbot powered by Groq API. The bot answers job-related questions for staffand managers and is accessible via the admin sidebar.

## Architecture

### Frontend (React/Vite)
- **Route:** `/admin/ai-assistant`
- **Sidebar Link:** "AI Assistant" in the "AI Tools" section
- **Components:**
  - [AiAssistant.jsx](atlastech-frontend/src/pages/admin/AiAssistant.jsx) - Main page
  - [StaffChatbotWidget.jsx](atlastech-frontend/src/components/admin/StaffChatbotWidget.jsx) - Chat UI
  
### Backend (Laravel)
- **API Endpoint:** `POST /api/admin/staff-chatbot/reply`
- **Controller:** [StaffChatbotController.php](atlastech-backend/app/Http/Controllers/Api/Admin/StaffChatbotController.php)
- **Authentication:** Requires `auth:sanctum` (authenticated admin users only)
- **Rate Limiting:** 20 requests per minute

---

## Setup Instructions

### Step 1: Get Groq API Key

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (you'll need it in the next step)

**Available Models:**
- `mixtral-8x7b-32768` (Fast, good for general questions) - Default
- `llama2-70b-4096` (More capable)
- `llama3-70b-8192` (Latest)

### Step 2: Configure Environment Variables

Edit `.env` in the backend directory:

```bash
# Groq AI Configuration for Staff Chatbot
STAFF_AI_API_KEY=your_groq_api_key_here
STAFF_AI_API_URL=https://api.groq.com/openai/v1/chat/completions
STAFF_AI_MODEL=mixtral-8x7b-32768
```

Replace `your_groq_api_key_here` with your actual Groq API key.

### Step 3: Verify Configuration

The configuration has already been added to `config/services.php`:

```php
'groq' => [
    'api_key' => env('STAFF_AI_API_KEY'),
    'api_url' => env('STAFF_AI_API_URL', 'https://api.groq.com/openai/v1/chat/completions'),
    'model' => env('STAFF_AI_MODEL', 'mixtral-8x7b-32768'),
],
```

### Step 4: Access the Chatbot

1. **Start the application:**
   ```bash
   # Backend (Laravel)
   php artisan serve
   
   # Frontend (React) - in another terminal
   npm run dev
   ```

2. **Navigate to the Admin Dashboard:**
   - Frontend: http://localhost:3000/admin (or your frontend URL)
   - Login with admin credentials

3. **Click "AI Assistant" in the sidebar**
   - You'll see the Worker Assistant chatbot
   - Start typing job-related questions

---

## How It Works

### Chatbot Behavior

The chatbot is configured with a system prompt that:
- ✅ Answers questions about AtlasTech services, pricing, and policies
- ✅ Helps HR with employee-related questions
- ✅ Assists IT with technical systems questions
- ✅ Provides information about company procedures
- ❌ Refuses general knowledge questions (weather, jokes, etc.)
- ❌ Declines off-topic questions politely

**Example Queries:**
- "How do I submit a leave request?" → ✅ Answers
- "Tell me a joke" → ❌ "I'm here to help with AtlasTech questions only."
- "What are our service packages?" → ✅ Answers
- "What's the weather?" → ❌ Politely declines

### Request Flow

```
User Message (Frontend)
    ↓
POST /api/admin/staff-chatbot/reply (with auth token)
    ↓
StaffChatbotController (verifies authentication)
    ↓
HTTP POST to Groq API
    ↓
Groq returns response
    ↓
Response sent back to frontend
    ↓
Message displayed in chat UI
```

### Technical Details

**Controller:** [StaffChatbotController.php](atlastech-backend/app/Http/Controllers/Api/Admin/StaffChatbotController.php)
- Validates incoming messages (max 1000 characters)
- Adds system prompt to maintain context
- Handles API errors gracefully
- Logs errors to Laravel logs
- Temperature: 0.7 (balanced between creative and deterministic)
- Max tokens: 500 (limits response length)

---

## Testing the Setup

### Test in Browser

1. Open your admin dashboard
2. Click "AI Assistant" in the sidebar
3. Try these test questions:
   - "What services does AtlasTech offer?" (Should answer)
   - "How do I get a raise?" (Should answer with HR context)
   - "What's 2+2?" (Should decline as general knowledge)

### Test via cURL (Backend Only)

```bash
curl -X POST http://localhost:8000/api/admin/staff-chatbot/reply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SANCTUM_TOKEN" \
  -d '{
    "message": "What are our service packages?"
  }'
```

Example Response:
```json
{
  "success": true,
  "message": "AtlasTech offers several service packages including Web Development, Landing Pages, E-commerce Solutions, Mobile App Development, SEO Optimization, and Maintenance & Support services."
}
```

### Test via PowerShell Script

Create `test-staff-chatbot.ps1`:

```powershell
$token = "YOUR_SANCTUM_TOKEN"
$message = "What services does AtlasTech offer?"

$body = @{
    message = $message
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$response = Invoke-RestMethod -Uri "http://localhost:8000/api/admin/staff-chatbot/reply" `
    -Method POST `
    -Headers $headers `
    -Body $body

Write-Host "Response:" -ForegroundColor Green
$response | ConvertTo-Json | Write-Host
```

---

## Security & Rate Limiting

### Authentication
- Requires valid Sanctum auth token (automatic when logged into admin dashboard)
- Only authenticated users can access the chatbot

### Rate Limiting
- **Limit:** 20 requests per minute per user
- **Behavior:** Exceeding limit returns 429 Too Many Requests
- **For production:** Consider using cache-based request throttling

### Environment Security
- **Never** commit your `.env` file with the API key
- **Rotate** API keys regularly
- **Monitor** Groq API usage in your console

---

## Troubleshooting

### Issue: "AI Service not configured"
**Solution:** 
- Verify `STAFF_AI_API_KEY` is set in `.env`
- Check that the key is not wrapped in quotes
- Restart the Laravel development server

### Issue: "Error communicating with the AI service"
**Causes:**
- Invalid API key
- Groq API service down
- Network connectivity issues
- Rate limit exceeded

**Solution:**
- Check Laravel logs: `storage/logs/laravel.log`
- Verify API key is valid in Groq console
- Check internet connection

### Issue: Chatbot responses are too long
**Solution:**
- Edit `max_tokens` in StaffChatbotController (currently 500)
- Reduce to 200-300 for shorter responses

### Issue: Chatbot not following system prompt
**Solution:**
- Change model to `llama2-70b-4096` (more rule-following)
- Adjust temperature (0.7) - lower = more deterministic
- Refine system prompt in controller

---

## Customization

### Change System Prompt

Edit [StaffChatbotController.php](atlastech-backend/app/Http/Controllers/Api/Admin/StaffChatbotController.php):

```php
$systemPrompt = "Your custom system prompt here...";
```

### Change AI Model

Edit `.env`:
```bash
STAFF_AI_MODEL=llama2-70b-4096
```

### Adjust Rate Limiting

In [routes/api.php](atlastech-backend/routes/api.php):
```php
Route::post('/staff-chatbot/reply', [...])
    ->middleware('throttle:60,1'); // 60 requests per minute
```

### Enable Message History (Optional)

Modify `StaffChatbotWidget.jsx` to store messages in state and send conversation history:

```javascript
// Send previous messages for context
const messages = [
  ...previousMessages.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.text
  })),
  { role: 'user', content: message }
];
```

Update backend to accept previous messages:
```php
$validated = $request->validate([
    'message' => 'required|string|max:1000',
    'previous_messages' => 'nullable|array',
]);
```

---

## Monitoring & Analytics

### View API Logs
```bash
tail -f storage/logs/laravel.log | grep -i "chatbot\|Staff"
```

### Monitor Groq API Usage
1. Visit [console.groq.com](https://console.groq.com)
2. Go to API Usage section
3. Monitor token consumption and costs

### Check Response Times
- Add timing headers in StaffChatbotController
- Track API response times in monitoring tools

---

## Production Deployment

### Before Deploying:

1. ✅ Update `.env` with production Groq API key
2. ✅ Set `APP_ENV=production` in `.env`
3. ✅ Increase rate limiting limits if needed
4. ✅ Configure error logging to external service (e.g., Sentry)
5. ✅ Test thoroughly with production data
6. ✅ Review security headers middleware

### Deployment Steps:

```bash
# 1. Pull latest code
git pull origin main

# 2. Update environment
cp .env.production .env

# 3. Clear caches
php artisan cache:clear
php artisan config:cache

# 4. Deploy
php artisan migrate --force
php artisan queue:restart

# 5. Verify
curl -X POST https://api.atlastech.com/api/admin/staff-chatbot/reply \
  -H "Authorization: Bearer $TOKEN"
```

---

## Support & Additional Resources

- **Groq API Docs:** https://console.groq.com/docs
- **Laravel Sanctum:** https://laravel.com/docs/sanctum
- **Rate Limiting:** https://laravel.com/docs/rate-limiting
- **Error Logs:** `/atlastech-backend/storage/logs/laravel.log`

---

## Checklist

- [ ] Groq API key obtained
- [ ] `.env` updated with API key
- [ ] `config/services.php` verified
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Admin login successful
- [ ] "AI Assistant" link visible in sidebar
- [ ] Chatbot page loads
- [ ] Test message sent and response received
- [ ] Response follows system prompt rules
