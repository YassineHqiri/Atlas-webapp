<?php

namespace Database\Seeders;

use App\Models\ServicePack;
use Illuminate\Database\Seeder;

class ServicePackSeeder extends Seeder
{
    public function run(): void
    {
        $servicePacks = [
            [
                'name' => 'Basic Pack',
                'description' => 'Perfect for small businesses starting their online journey. Includes essential web development features to get your business online quickly.',
                'price' => 499.00,
                'features' => [
                    '5-page responsive website',
                    'Contact form integration',
                    'Basic SEO optimization',
                    'Mobile-friendly design',
                    '1 month support',
                    'Social media links',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Professional Pack',
                'description' => 'Ideal for growing businesses that need more advanced features and customization. Perfect for establishing a strong online presence.',
                'price' => 999.00,
                'features' => [
                    '10-page responsive website',
                    'Advanced contact form',
                    'Full SEO package',
                    'CMS integration',
                    'Blog functionality',
                    'Analytics integration',
                    '3 months support',
                    'Custom animations',
                    'E-commerce ready',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Enterprise Pack',
                'description' => 'Comprehensive solution for large organizations requiring custom development, advanced features, and dedicated support.',
                'price' => 2499.00,
                'features' => [
                    'Unlimited pages',
                    'Custom web application',
                    'Advanced SEO & marketing',
                    'User authentication',
                    'Payment gateway integration',
                    'API development',
                    'Database design',
                    '12 months priority support',
                    'Dedicated account manager',
                    'Custom integrations',
                ],
                'is_active' => true,
            ],
        ];

        foreach ($servicePacks as $pack) {
            ServicePack::updateOrCreate(
                ['name' => $pack['name']],
                $pack
            );
        }
    }
}
