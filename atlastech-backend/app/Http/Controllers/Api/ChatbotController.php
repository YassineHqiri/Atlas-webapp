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
    private const DEFAULT_RESPONSE = "Je n'ai pas trouvé la réponse à votre question. Veuillez contacter notre équipe : support@atlastech.com";
    private const RATE_LIMIT_KEY = 'chatbot';
    private const RATE_LIMIT_PER_MINUTE = 10;
    private const SIMILARITY_THRESHOLD = 0.15; // 15% de similarité minimum

    public function reply(Request $request): JsonResponse
    {
        // ============ SÉCURITÉ & VALIDATION ============
        $userMessage = strip_tags(trim($request->input('message', '')));

        // Validation
        if (empty($userMessage)) {
            return response()->json([
                'success' => false,
                'message' => 'Le message ne peut pas être vide',
            ], 400);
        }

        if (strlen($userMessage) > 255) {
            return response()->json([
                'success' => false,
                'message' => 'Le message ne doit pas dépasser 255 caractères',
            ], 422);
        }

        // ============ RATE LIMITING ============
        $ip = $this->getClientIp($request);
        $rateLimitKey = self::RATE_LIMIT_KEY . ':' . $ip;

        if (RateLimiter::tooManyAttempts($rateLimitKey, self::RATE_LIMIT_PER_MINUTE)) {
            Log::warning('Chatbot rate limit exceeded', ['ip' => $ip]);
            return response()->json([
                'success' => false,
                'message' => 'Trop de requêtes. Veuillez attendre quelques minutes.',
            ], 429);
        }

        RateLimiter::hit($rateLimitKey, 60); // 60 secondes

        // ============ RECHERCHE FAQ INTELLIGENTE ============
        $faq = $this->findBestMatch($userMessage);
        $botResponse = $faq ? $faq->answer : self::DEFAULT_RESPONSE;

        // ============ ENREGISTRER LE LOG ============
        try {
            ChatLog::create([
                'user_message' => $userMessage,
                'bot_response' => $botResponse,
                'ip_address' => $ip,
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'enregistrement du chat log', [
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => $botResponse,
            'found' => !!$faq,
        ]);
    }

    /**
     * Trouve la meilleure correspondance FAQ avec algorithme intelligent
     * Utilise:
     * - Tokenization avec suppression des mots vides français
     * - Similarité Jaccard entre ensembles de mots-clés
     * - Correspondance partielle via Levenshtein
     */
    private function findBestMatch(string $userMessage): ?Faq
    {
        $faqs = Faq::active()->get();
        
        if ($faqs->isEmpty()) {
            return null;
        }

        $scores = [];
        $userWords = $this->tokenizeText($userMessage);

        foreach ($faqs as $faq) {
            // Utiliser uniquement la question pour le matching (pas la réponse)
            $faqWords = $this->tokenizeText($faq->question);
            
            // Calculer un score de pertinence
            $score = $this->calculateSimilarity($userWords, $faqWords);
            
            if ($score > self::SIMILARITY_THRESHOLD) {
                $scores[$faq->id] = [
                    'faq' => $faq,
                    'score' => $score
                ];
            }
        }

        if (empty($scores)) {
            return null;
        }

        // Retourner la FAQ avec le meilleur score
        usort($scores, fn($a, $b) => $b['score'] <=> $a['score']);
        
        return $scores[0]['faq'];
    }

    /**
     * Divise le texte en mots significatifs (tokenization)
     * Élimine les mots vides français
     */
    private function tokenizeText(string $text): array
    {
        $text = strtolower($text);
        
        // Remplacer tirets et apostrophes par espaces AVANT de nettoyer
        $text = preg_replace('/[\s\-\']+/', ' ', $text);
        
        // Supprimer caractères spéciaux mais garder lettres/accents/chiffres
        $text = preg_replace('/[^a-zàâäæçéèêëïîôöœüûùçñ0-9\s]/i', '', $text);
        
        // Diviser par espaces
        $words = preg_split('/\s+/', $text, -1, PREG_SPLIT_NO_EMPTY);
        
        // Mots vides français à ignorer
        $stopwords = [
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
        
        return array_filter($words, fn($word) => 
            strlen($word) > 1 && !in_array($word, $stopwords)
        );
    }

    /**
     * Calcule la similarité entre deux ensembles de mots
     * Utilise Jaccard similarity + bonus pour les stemmes communs
     */
    private function calculateSimilarity(array $userWords, array $faqWords): float
    {
        if (empty($userWords) || empty($faqWords)) {
            return 0;
        }

        $intersect = 0;
        
        foreach ($userWords as $userWord) {
            foreach ($faqWords as $faqWord) {
                // Correspondance exacte
                if ($userWord === $faqWord) {
                    $intersect++;
                    break;
                }
                
                // Correspondance partielle (au moins 70% d'identité)
                if ($this->stringSimilarity($userWord, $faqWord) > 0.7) {
                    $intersect += 0.7;
                    break;
                }
            }
        }

        // Jaccard similarity: intersection / union
        $union = count(array_unique(array_merge($userWords, $faqWords)));
        $similarity = $union > 0 ? $intersect / $union : 0;

        return min($similarity, 1.0);
    }

    /**
     * Similarité entre deux mots (Levenshtein)
     */
    private function stringSimilarity(string $str1, string $str2): float
    {
        $maxLen = max(strlen($str1), strlen($str2));
        
        if ($maxLen === 0) {
            return 1.0;
        }

        $distance = levenshtein($str1, $str2);
        
        return 1.0 - ($distance / $maxLen);
    }

    /**
     * Récupère l'adresse IP du client en toute sécurité
     */
    private function getClientIp(Request $request): string
    {
        if (!empty($request->server('HTTP_CLIENT_IP'))) {
            $ip = $request->server('HTTP_CLIENT_IP');
        } elseif (!empty($request->server('HTTP_X_FORWARDED_FOR'))) {
            $ip = $request->server('HTTP_X_FORWARDED_FOR');
        } else {
            $ip = $request->server('REMOTE_ADDR');
        }

        // Valider l'IP
        if (!filter_var($ip, FILTER_VALIDATE_IP)) {
            $ip = '0.0.0.0';
        }

        return $ip;
    }
}
