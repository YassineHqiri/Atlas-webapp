<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PasswordResetCodeNotification extends Notification
{
    use Queueable;

    public function __construct(
        public string $code,
        public string $email
    ) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your Password Reset Code - Atlas Tech')
            ->greeting('Hello!')
            ->line('You requested a password reset for your AtlasTech account.')
            ->line('Your verification code is:')
            ->line('**' . $this->code . '**')
            ->line('This code will expire in 15 minutes.')
            ->line('If you did not request a password reset, please ignore this email.')
            ->line('Do not share this code with anyone.');
    }
}
