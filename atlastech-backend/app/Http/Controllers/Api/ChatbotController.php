<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\ChatLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ChatbotController extends Controller
{
    private const DEFAULT_RESPONSE_FR = "Je n'ai pas trouvé la réponse à votre question. Veuillez contacter notre équipe : support@atlastech.com";
    private const DEFAULT_RESPONSE_EN = "I couldn't find an answer to your question. Please contact our team: support@atlastech.com";
    private const RATE_LIMIT_KEY = 'chatbot';
    private const RATE_LIMIT_PER_MINUTE = 10;
    private const SIMILARITY_THRESHOLD = 0.15;
    private const SUPPORTED_LANGUAGES = ['fr', 'en'];

    public function reply(Request $request): JsonResponse
    {
        $userMessage = strip_tags(trim($request->input('message', '')));
        $language = trim($request->input('language', 'fr'));
        
        if (!in_array($language, self::SUPPORTED_LANGUAGES)) {
            $language = 'fr';
        }

        if (empty($userMessage)) {
            $message = $language === 'en' ? 'Message cannot be empty' : 'Le message ne peut pas être vide';
            return response()->json(['success' => false, 'message' => $message], 400);
        }

        if (strlen($userMessage) > 255) {
            $message = $language === 'en' ? 'Message must not exceed 255 characters' : 'Le message ne doit pas dépasser 255 caractères';
            return response()->json(['success' => false, 'message' => $message], 422);
        }

        $ip = $this->getClientIp($request);
        $rateLimitKey = self::RATE_LIMIT_KEY . ':' . $ip;

        if (RateLimiter::tooManyAttempts($rateLimitKey, self::RATE_LIMIT_PER_MINUTE)) {
            Log::warning('Chatbot rate limit exceeded', ['ip' => $ip]);
            $message = $language === 'en' ? 'Too many requests. Please wait a few minutes.' : 'Trop de requêtes. Veuillez attendre quelques minutes.';
            return response()->json(['success' => false, 'message' => $message], 429);
        }

        RateLimiter::hit($rateLimitKey, 60);

        $faq = $this->findBestMatch($userMessage, $language);
        $defaultResponse = $language === 'en' ? self::DEFAULT_RESPONSE_EN : self::DEFAULT_RESPONSE_FR;
        $botResponse = $faq ? $faq->answer : $defaultResponse;

        try {
            ChatLog::create([
                'user_message' => $userMessage,
                'bot_response' => $botResponse,
                'ip_address' => $ip,
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'enregistrement du chat log', ['error' => $e->getMessage()]);
        }

        return response()->json([
            'success' => true,
            'message' => $botResponse,
            'found' => !!$faq,
            'language' => $language,
        ]);
    }

    private function findBestMatch(string $userMessage, string $language = 'fr'): ?Faq
    {
        $faqs = Faq::active()->language($language)->get();
        
        if ($faqs->isEmpty()) {
            return null;
        }

        $scores = [];
        $userWords = $this->tokenizeText($userMessage, $language);

        foreach ($faqs as $faq) {
            $faqWords = $this->tokenizeText($faq->question, $language);
            $score = $this->calculateSimilarity($userWords, $faqWords);
            
            if ($score > self::SIMILARITY_THRESHOLD) {
                $scores[$faq->id] = ['faq' => $faq, 'score' => $score];
            }
        }

        if (empty($scores)) {
            return null;
        }

        usort($scores, fn($a, $b) => $b['score'] <=> $a['score']);
        return $scores[0]['faq'];
    }

    private function tokenizeText(string $text, string $language = 'fr'): array
    {
        $text = strtolower($text);
        $text = preg_replace('/[\s\-\']+/', ' ', $text);
        $text = preg_replace('/[^a-zàâäæçéèêëïîôöœüûùçñ0-9\s]/i', '', $text);
        $words = preg_split('/\s+/', $text, -1, PREG_SPLIT_NO_EMPTY);
        
        $stopwords = $this->getStopwords($language);
        
        return array_filter($words, fn($word) => 
            strlen($word) > 1 && !in_array($word, $stopwords)
        );
    }

    private function getStopwords(string $language = 'fr'): array
    {
        if ($language === 'en') {
            return [
                'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
                'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be',
                'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us',
                'them', 'my', 'your', 'his', 'its', 'our', 'their', 'that',
                'this', 'these', 'those', 'can', 'could', 'would', 'should', 'do',
                'does', 'did', 'will', 'have', 'has', 'had', 'not', 'no', 'way'
            ];
        }

        return [
            'et', 'ou', 'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du',
            'à', 'au', 'dont', 'que', 'qui', 'qu', 'est', 'c', 'ç', 'ce',
            'cet', 'cette', 'ces', 'mon', 'ma', 'tes', 'ton', 'ta',
            'ses', 'son', 'sa', 'nos', 'notre', 'vos', 'votre', 'leurs',
            'en', 'dans', 'sur', 'sous', 'par', 'pour', 'avec', 'sans',
            'il', 'ils', 'elle', 'elles', 'je', 'tu', 'nous', 'vous',
            'moi', 'toi', 'lui', 'eux', 'y', 'là', 'ici', 'autre', 'pas',
            'ne', 'non', 'oui', 'si', 'être', 'avoir', 'aller', 'faire',
            'pouvoir', 'vouloir', 'devoir', 'savoir', 'aux', 'où', 'alors'
        ];
    }

    private function calculateSimilarity(array $userWords, array $faqWords): float
    {
        if (empty($userWords) || empty($faqWords)) {
            return 0;
        }

        $intersect = 0;
        
        foreach ($userWords as $userWord) {
            foreach ($faqWords as $faqWord) {
                if ($userWord === $faqWord) {
                    $intersect++;
                    break;
                }
                
                if ($this->stringSimilarity($userWord, $faqWord) > 0.7) {
                    $intersect += 0.7;
                    break;
                }
            }
        }

        $union = count(array_unique(array_merge($userWords, $faqWords)));
        $similarity = $union > 0 ? $intersect / $union : 0;

        return min($similarity, 1.0);
    }

    private function stringSimilarity(string $str1, string $str2): float
    {
        $maxLen = max(strlen($str1), strlen($str2));
        
        if ($maxLen === 0) {
            return 1.0;
        }

        $distance = levenshtein($str1, $str2);
        return 1.0 - ($distance / $maxLen);
    }

    private function getClientIp(Request $request): string
    {
        if (!empty($request->server('HTTP_CLIENT_IP'))) {
            $ip = $request->server('HTTP_CLIENT_IP');
        } elseif (!empty($request->server('HTTP_X_FORWARDED_FOR'))) {
            $ip = $request->server('HTTP_X_FORWARDED_FOR');
        } else {
            $ip = $request->server('REMOTE_ADDR');
        }

        if (!filter_var($ip, FILTER_VALIDATE_IP)) {
            $ip = '0.0.0.0';
        }

        return $ip;
    }
}
