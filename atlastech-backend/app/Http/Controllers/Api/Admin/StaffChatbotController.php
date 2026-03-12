<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class StaffChatbotController extends Controller
{
    /**
     * Handle internal staff chatbot requests using Groq/OpenRouter.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function reply(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $userMessage = $request->input('message');
        $apiKey = config('services.groq.api_key');
        $apiUrl = config('services.groq.api_url');
        $model = config('services.groq.model');

        if (empty($apiKey)) {
            Log::error('Chatbot: AI API key not configured');
            return response()->json([
                'success' => false,
                'message' => 'AI Service not configured. Please contact your IT department.',
            ], 500);
        }

        $systemPrompt = "You are an AI assistant for AtlasTech Solutions, a web development company that sells service packages to small and medium-sized enterprises (SMEs).

AtlasTech offers the following services:
1. Web Development Service Packs - Custom websites for businesses
2. Landing Pages - Professional landing pages for marketing
3. E-commerce Solutions - Online store setup and management
4. Mobile App Development - iOS and Android applications
5. SEO Optimization - Search engine optimization services
6. Maintenance & Support - Ongoing website maintenance and technical support

Your responsibilities:
- Answer ONLY questions related to AtlasTech's services, pricing, policies, and operations
- Help sales managers understand service packages and pricing
- Assist HR with employee-related questions and policies
- Support IT with technical questions about systems and processes
- Provide information about company procedures and workflows

IMPORTANT RULES:
- Do NOT answer general knowledge questions (weather, jokes, news, etc.)
- Do NOT answer questions unrelated to AtlasTech
- If asked about something outside AtlasTech, politely say: \"I'm here to help with AtlasTech questions only. Please ask about our services, pricing, or company policies.\"
- Always be professional and helpful
- If you don't know an answer, say: \"I don't have that information. Please contact your manager or HR department.\"

You are speaking to AtlasTech employees (managers, HR, IT staff), not customers.";

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->post($apiUrl, [
                'model' => $model,
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $userMessage],
                ],
                'temperature' => 0.7,
                'max_tokens' => 500,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $reply = $data['choices'][0]['message']['content'] ?? 'No response from AI.';

                return response()->json([
                    'success' => true,
                    'message' => $reply,
                ]);
            }

            // Detailed error logging for debugging
            $statusCode = $response->status();
            $responseBody = $response->body();
            Log::error("AI API Error - Status: {$statusCode}, Body: {$responseBody}, Model: {$model}, URL: {$apiUrl}");

            // Provide more helpful error message based on status code
            $errorMessage = 'Error communicating with the AI service.';
            if ($statusCode === 401) {
                $errorMessage = 'AI service authentication failed. Please contact IT.';
            } elseif ($statusCode === 429) {
                $errorMessage = 'AI service rate limit exceeded. Please try again later.';
            } elseif ($statusCode >= 500) {
                $errorMessage = 'AI service is temporarily unavailable. Please try again later.';
            }

            return response()->json([
                'success' => false,
                'message' => $errorMessage,
            ], 500);

        } catch (\Exception $e) {
            Log::error('Chatbot Exception: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred.',
            ], 500);
        }
    }
}
