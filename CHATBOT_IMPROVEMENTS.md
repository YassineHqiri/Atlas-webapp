# Améliorations du Chatbot - Recherche Intelligente

## Résumé des modifications

Le chatbot a été amélioré pour comprendre **des variations de questions** plutôt que de rechercher des mots-clés exacts. L'ancien système utilisait une simple recherche `LIKE`, le nouveau utilise un **algorithme de similarité sémantique**.

## Changements techniques

### 1. **Algorithme de tokenization**
- Divise les questions en mots-clés significatifs
- Supprime les caractères spéciaux et apostrophes
- Élimine les mots vides français (et, ou, le, la, est, c'est, etc.)
- Filtre les mots trop courts (< 2 caractères)

### 2. **Algorithme de similarité Jaccard**
```
Score = Intersection / Union de mots-clés
```
- Trouve la meilleure correspondance entre mots de l'utilisateur et FAQs
- Seuil minimum: 15% de similarité
- Retourne la FAQ avec le score le plus élevé

### 3. **Correspondance partielle (Levenshtein)**
- Accepte les mots partiellement similaires (70% de correspondance)
- Gère les petites variations d'orthographe
- Exemple: "proposez" ≈ "propose" → Correspondance trouvée

## Résultats des tests

✅ **Mots-clés exacts:** "Quels services proposez-vous ?"
✅ **Variantes conversationnelles:** "est ce qu'il ya des autres services"
✅ **Questions tarifaires:** "combien coute le basic pack"
✅ **Questions de support:** "on peut faire du support apres lancement"
⚠️ **Très générales:** "parlons de votre offre globale" (pas de FAQ correspondante)

## Exemples de correspondances maintenant possibles

| Input utilisateur | FAQ trouvée | Ancien système |
|---|---|---|
| Quels services proposez-vous ? | ✅ Quels services proposez-vous ? | ✅ OK |
| est ce qu'il ya des autres services | ✅ Quels services proposez-vous ? | ❌ Non |
| quel est le tarif du basic | ✅ Quel est le prix du Basic Pack ? | ❌ Non |
| avez-vous du support après lancement | ✅ Offrez-vous du support après lancement ? | ❌ Non |
| proposez vous hebergement web | ✅ Proposez-vous de l'hébergement web ? | ❌ Non |

## Fichiers modifiés

- **app/Http/Controllers/Api/ChatbotController.php**
  - Remplacement de `Faq::search($message)` par `$this->findBestMatch($message)`
  - Nouvelles méthodes: `tokenizeText()`, `calculateSimilarity()`, `stringSimilarity()`
  - Constante: `SIMILARITY_THRESHOLD = 0.15`

## Avantages

1. **Plus naturel:** Comprend les variations de langage
2. **Plus robuste:** Gère les paraphrases et variations
3. **Flexible:** Peut être affiné en ajustant le seuil de similarité
4. **Performant:** Pas d'appels API externes (OpenAI, etc.)

## Configuration fine possible

Pour être **plus strict** (moins de faux positifs):
```php
private const SIMILARITY_THRESHOLD = 0.25; // 25% au lieu de 15%
```

Pour être **plus permissif** (plus de correspondances):
```php
private const SIMILARITY_THRESHOLD = 0.1; // 10% au lieu de 15%
```

## Prochaines étapes possibles

1. **Admin panel:** Permet aux utilisateurs de CRUD les FAQs
2. **Analytics:** Suivre les questions les plus posées et les taux de résolution
3. **Handoff:** Transférer à un humain si confiance < 50%
4. **Multi-langue:** Support FR/EN/AR
5. **IA avancée:** Intégration OpenAI/Claude pour questions hors FAQ
