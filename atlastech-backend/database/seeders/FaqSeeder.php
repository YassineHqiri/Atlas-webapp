<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = [
            [
                'question' => 'Quels services proposez-vous ?',
                'answer' => 'Nous proposons trois packs principaux : Basic Pack (pour PME), Professional Pack (pour entreprises en croissance) et Enterprise Pack (solution complète personnalisée). Chaque pack inclut développement web, SEO, et support client.',
                'is_active' => true,
            ],
            [
                'question' => 'Quel est le prix du Basic Pack ?',
                'answer' => 'Le Basic Pack coûte 499 DH. Il comprend 5 pages responsive, formulaire de contact, SEO basique, design mobile-friendly et 1 mois de support.',
                'is_active' => true,
            ],
            [
                'question' => 'Combien coûte le Professional Pack ?',
                'answer' => 'Le Professional Pack est proposé à 999 DH. Il inclut 10 pages, fonctionnalité CMS, blog, intégration analytics, animations personnalisées et 3 mois de support.',
                'is_active' => true,
            ],
            [
                'question' => 'Comment puis-je commander un service ?',
                'answer' => 'Vous pouvez commander directement via notre site web. Accédez à la page Services, choisissez votre pack et cliquez sur "Commencer". Remplissez vos informations et procédez au paiement. Votre projet sera attribué à notre équipe.',
                'is_active' => true,
            ],
            [
                'question' => 'Combien de temps prend un projet ?',
                'answer' => 'Les délais varient selon le pack : Basic (2-3 semaines), Professional (4-6 semaines), Enterprise (8-12 semaines). Des délais accélérés sont possibles moyennant frais supplémentaires.',
                'is_active' => true,
            ],
            [
                'question' => 'Offrez-vous du support après lancement ?',
                'answer' => 'Oui ! Chaque pack inclut du support gratuit : Basic (1 mois), Professional (3 mois), Enterprise (12 mois). Au-delà, nous proposons des forfaits de maintenance mensuels.',
                'is_active' => true,
            ],
            [
                'question' => 'Acceptez-vous les modifications personnalisées ?',
                'answer' => 'Absolument ! Notre pack Enterprise est entièrement personnalisable. Pour les autres packs, nous offrons des ajustements dans la limite de 2 demandes de modification incluses.',
                'is_active' => true,
            ],
            [
                'question' => 'Proposez-vous de l\'hébergement web ?',
                'answer' => 'Nous nous concentrons sur le développement. Cependant, nous recommandons des partenaires d\'hébergement fiables et pouvons vous aider à configurer votre site sur votre serveur.',
                'is_active' => true,
            ],
            [
                'question' => 'Vos sites sont-ils compatibles mobiles ?',
                'answer' => 'Oui, tous nos projets sont développés en responsive design. Votre site fonctionnera parfaitement sur ordinateurs, tablettes et smartphones.',
                'is_active' => true,
            ],
            [
                'question' => 'Faites-vous de la maintenance et des mises à jour ?',
                'answer' => 'Oui, nous proposons des forfaits de maintenance mensuels incluant mises à jour de sécurité, sauvegarde de données, et corrections de bugs. Contactez-nous pour plus de détails.',
                'is_active' => true,
            ],
            [
                'question' => 'Comment puis-je vous contacter ?',
                'answer' => 'Vous pouvez nous joindre via : Email : hello@atlastech.com | Téléphone : +212 (à remplir) | Formulaire de contact sur notre site. Nous répondons généralement en 24h.',
                'is_active' => true,
            ],
            [
                'question' => 'Proposez-vous une consultation gratuite ?',
                'answer' => 'Oui ! Nous offrons une consultation initiale gratuite (30 minutes) pour comprendre vos besoins et vous recommander la meilleure solution.',
                'is_active' => true,
            ],
        ];

        foreach ($faqs as $faq) {
            Faq::updateOrCreate(
                ['question' => $faq['question']],
                $faq
            );
        }
    }
}
