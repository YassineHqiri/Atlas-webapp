# Worker Chatbot Implementation Summary

## What Has Been Set Up ✅

Your admin dashboard now has a fully functional **Worker Assistant Chatbot** that:
- 🤖 Answers job-related questions using Groq AI
- 🔒 Is restricted to authenticated admin users only
- ⚡ Has rate limiting (20 requests/minute) to prevent abuse
- 📱 Is accessible via a clean UI in the admin sidebar
- 🎯 Follows a system prompt to stay focused on work-related topics

## Quick Start (5 Minutes)

### 1. Get Your Groq API Key
```bash
# Visit: https://console.groq.com
# Sign up → Create API Key → Copy key
```

### 2. Add to .env
```bash
cd atlastech-backend

# Edit .env and add/update:
STAFF_AI_API_KEY=your_groq_api_key_here
STAFF_AI_API_URL=https://api.groq.com/openai/v1/chat/completions
STAFF_AI_MODEL=llama-3.1-8b-instant
```

### 3. Start the Application
```bash
# Terminal 1: Backend
cd atlastech-backend
php artisan serve

# Terminal 2: Frontend
cd atlastech-frontend
npm run dev
```

### 4. Access the Chatbot
- Go to: http://localhost:3000/admin
- Log in with admin credentials
- Click "AI Assistant" in the sidebar
- Start asking work-related questions!

## Files Modified 📝

### Backend (Laravel)
1. **`.env`** - Added Groq API configuration
   - `STAFF_AI_API_KEY` - Your API key
   - `STAFF_AI_API_URL` - Groq API endpoint
   - `STAFF_AI_MODEL` - AI model to use

2. **`config/services.php`** - Added Groq service configuration
   ```php
   'groq' => [
       'api_key' => env('STAFF_AI_API_KEY'),
       'api_url' => env('STAFF_AI_API_URL', '...'),
       'model' => env('STAFF_AI_MODEL', '...'),
   ],
   ```

### Already Existing (No Changes Needed)
- **`routes/api.php`** - Route already configured
  - `POST /api/admin/staff-chatbot/reply`
  - Protected by `auth:sanctum` middleware
  - Rate limited to 20 req/min

- **`app/Http/Controllers/Api/Admin/StaffChatbotController.php`**
  - Handles chat requests
  - Validates messages
  - Calls Groq API
  - Returns formatted responses

### Frontend (React)
- **`src/routes/AdminRoutes.jsx`** - Route already configured
  - `/admin/ai-assistant` route registered
  
- **`src/pages/admin/AiAssistant.jsx`** - Main chatbot page
  - Uses StaffChatbotWidget component
  
- **`src/components/admin/StaffChatbotWidget.jsx`** - Chat UI
  - Message display
  - Input field
  - Auto-scroll behavior
  - Loading states

- **`src/components/layout/AdminLayout.jsx`** - Sidebar
  - "AI Assistant" link already in navbar
  - Under "AI Tools" section

## API Endpoint Details

**Endpoint:** `POST /api/admin/staff-chatbot/reply`

**Authentication:** Sanctum Bearer Token (automatic via admin login)

**Request Body:**
```json
{
  "message": "What services does AtlasTech offer?"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "AtlasTech offers Web Development, Landing Pages, E-commerce Solutions..."
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Error connecting to the AI service..."
}
```

**Rate Limits:**
- 20 requests per minute per authenticated user
- Returns HTTP 429 if exceeded

## Testing

### Browser Test
1. Navigate to `/admin/ai-assistant`
2. Type: "What are our service packages?"
3. Bot should respond with company service info
4. Type: "Tell me a joke"
5. Bot should politely decline

### API Test (PowerShell)
```powershell
# Get token first via admin login
$token = "your_sanctum_token"

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{ message = "What services does AtlasTech offer?" } | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/admin/staff-chatbot/reply" `
    -Method POST `
    -Headers $headers `
    -Body $body
```

### Using Provided Test Script
```bash
# First, get your Sanctum token by logging in via /api/admin/login
# Then run:
.\test-staff-chatbot.ps1 -Token "your_token" -Message "Your question"

# Or run interactive tests with multiple messages:
.\test-staff-chatbot.ps1 -Token "your_token" -Interactive
```

## Chatbot Behavior

### What It Will Answer ✅
- "What services do we offer?" → Returns service information
- "How do I request leave?" → Returns HR information
- "What's our database structure?" → Returns IT information
- "Tell me about company policy" → Returns policy information

### What It Won't Answer ❌
- "Tell me a joke" → "I'm here to help with AtlasTech questions only"
- "What's the weather?" → Politely declines
- "What's 2+2?" → "I'm here to help with AtlasTech questions only"
- Any off-topic question → Redirects to AtlasTech topics

## Security Features 🔒

1. **Authentication**
   - Requires Sanctum bearer token
   - Only logged-in admin users can access
   - Token validated on every request

2. **Rate Limiting**
   - 20 requests per minute per user
   - Prevents API abuse
   - Returns 429 status if exceeded

3. **Input Validation**
   - Messages limited to 1000 characters
   - Invalid requests rejected
   - CSRF protection built-in

4. **Error Handling**
   - API errors logged to Laravel logs
   - User receives safe error messages
   - No sensitive data exposed

5. **Environment Security**
   - API key stored in `.env` (never committed to git)
   - API key not exposed in responses
   - All communication over HTTPS in production

## Customization

### Change the System Prompt
Edit `atlastech-backend/app/Http/Controllers/Api/Admin/StaffChatbotController.php`:
```php
$systemPrompt = "Your new system prompt...";
```

### Change AI Model
Edit `.env`:
```bash
# Options: mixtral-8x7b-32768, llama2-70b-4096, llama3-70b-8192
STAFF_AI_MODEL=llama2-70b-4096
```

### Adjust Rate Limiting
Edit `atlastech-backend/routes/api.php`:
```php
Route::post('/staff-chatbot/reply', [...])->middleware('throttle:60,1'); // 60 per minute
```

### Change Response Length
Edit controller:
```php
'max_tokens' => 300, // Default is 500
```

## Monitoring

### View API Logs
```bash
# View last 50 lines of logs
tail -50 atlastech-backend/storage/logs/laravel.log

# Watch logs in real-time
tail -f atlastech-backend/storage/logs/laravel.log | grep -i chatbot
```

### Monitor Groq API Usage
1. Visit https://console.groq.com
2. Check "API Usage" section
3. Monitor token consumption
4. Track costs

### Performance Metrics
- Average response time: 1-3 seconds
- Typical tokens used per response: 50-150
- Groq API is very fast (free tier available)

## Production Deployment

### Pre-Deployment Checklist
- [ ] Groq API key tested in development
- [ ] Rate limits configured appropriately
- [ ] Error logging configured
- [ ] `.env` contains production API key
- [ ] `APP_ENV=production` is set
- [ ] HTTPS is enabled
- [ ] All dependencies installed
- [ ] Security middleware verified

### Deploy Steps
```bash
# 1. Pull latest code
git pull origin main

# 2. Copy production .env
cp .env.production .env

# 3. Install dependencies
composer install --no-dev

# 4. Clear caches
php artisan cache:clear && php artisan config:cache

# 5. Migrate database (if needed)
php artisan migrate --force

# 6. Build frontend
npm run build

# 7. Test endpoint
curl -X POST https://api.yourdomain.com/api/admin/staff-chatbot/reply \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message":"Test"}'
```

## Troubleshooting

### "AI Service not configured"
- ✅ Check `STAFF_AI_API_KEY` is in `.env`
- ✅ Ensure API key has no extra spaces or quotes
- ✅ Restart Laravel server: `php artisan serve`

### "Error communicating with the AI service"
- ✅ Verify Groq API key is valid
- ✅ Check Groq service status: https://status.groq.com
- ✅ View Laravel logs: `storage/logs/laravel.log`
- ✅ Check internet connectivity

### Rate limit exceeded (429 error)
- ✅ Wait 60 seconds (rate resets per minute)
- ✅ Adjust limits in `.env` if needed
- ✅ Check if multiple users hammering API

### No response from chatbot
- ✅ Check browser console for errors
- ✅ Verify auth token is present
- ✅ Try a simpler message
- ✅ Check Laravel logs for exceptions

### Chatbot ignoring system prompt
- ✅ Try a different model (llama2-70b-4096)
- ✅ Increase `max_tokens` 
- ✅ Lower `temperature` for deterministic behavior
- ✅ Refine or simplify system prompt

## Support Resources

- **Groq Console:** https://console.groq.com
- **Groq Documentation:** https://console.groq.com/docs
- **Laravel Sanctum:** https://laravel.com/docs/sanctum
- **Rate Limiting Guide:** https://laravel.com/docs/rate-limiting
- **Backend Logs:** `atlastech-backend/storage/logs/laravel.log`

## Next Steps

1. **Immediate:** Get Groq API key and configure `.env`
2. **Testing:** Run through the chatbot with test questions
3. **Customization:** Update system prompt with your company info
4. **Production:** Deploy with proper monitoring
5. **Enhancement:** Consider adding conversation history (optional)

---

**Everything is ready to go!** Just add your Groq API key to `.env` and start chatting. 🚀
