<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqEnglishSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = [
            [
                'language' => 'en',
                'question' => 'What services do you offer?',
                'answer' => 'We offer three main packages: Basic Pack (for SMEs), Professional Pack (for growing businesses), and Enterprise Pack (fully customized solution). Each package includes web development, SEO, and customer support.',
                'is_active' => true,
            ],
            [
                'language' => 'en',
                'question' => 'What is the price of the Basic Pack?',
                'answer' => 'The Basic Pack costs 499 DH. It includes 5 responsive pages, contact form, basic SEO, mobile-friendly design, and 1 month of support.',
                'is_active' => true,
            ],
            [
                'language' => 'en',
                'question' => 'How much does the Professional Pack cost?',
                'answer' => 'The Professional Pack is priced at 999 DH. It includes 10 pages, CMS functionality, blog, analytics integration, custom animations, and 3 months of support.',
                'is_active' => true,
            ],
            [
                'language' => 'en',
                'question' => 'How do I place an order?',
                'answer' => 'You can order directly through our website. Go to the Services page, choose your package, and click "Get Started". Fill in your information and proceed with payment. Your project will be assigned to our team.',
                'is_active' => true,
            ],
            [
                'language' => 'en',
                'question' => 'How long does a project take?',
                'answer' => 'Timelines vary by package: Basic (2-3 weeks), Professional (4-6 weeks), Enterprise (8-12 weeks). Expedited timelines are available for an additional fee.',
                'is_active' => true,
            ],
            [
                'language' => 'en',
                'question' => 'Do you offer support after launch?',
                'answer' => 'Yes! Each package includes free support: Basic (1 month), Professional (3 months), Enterprise (12 months). Beyond that, we offer monthly maintenance packages.',
                'is_active' => true,
            ],
            [
                'language' => 'en',
                'question' => 'Do you accept custom modifications?',
                'answer' => 'Absolutely! Our Enterprise pack is fully customizable. For other packages, we offer adjustments within the limit of 2 included revision requests.',
                'is_active' => true,
            ],
            [
                'language' => 'en',
                'question' => 'Do you provide web hosting?',
                'answer' => 'We focus on development. However, we recommend reliable hosting partners and can help you set up your site on your server.',
                'is_active' => true,
            ],
            [
                'language' => 'en',
                'question' => 'Are your websites mobile-compatible?',
                'answer' => 'Yes, all our projects are developed with responsive design. Your site will work perfectly on desktops, tablets, and smartphones.',
                'is_active' => true,
            ],
            [
                'language' => 'en',
                'question' => 'Do you offer maintenance and updates?',
                'answer' => 'Yes, we offer monthly maintenance packages including security updates, data backup, and bug fixes. Contact us for details.',
                'is_active' => true,
            ],
            [
                'language' => 'en',
                'question' => 'How can I contact you?',
                'answer' => 'You can reach us via: Email: hello@atlastech.com | Phone: +212 (to be filled) | Contact form on our website. We typically respond within 24 hours.',
                'is_active' => true,
            ],
            [
                'language' => 'en',
                'question' => 'Do you offer a free consultation?',
                'answer' => 'Yes! We offer a free initial consultation (30 minutes) to understand your needs and recommend the best solution for you.',
                'is_active' => true,
            ],
        ];

        foreach ($faqs as $faq) {
            Faq::updateOrCreate(
                ['question' => $faq['question'], 'language' => $faq['language']],
                $faq
            );
        }
    }
}
