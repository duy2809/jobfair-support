<?php

namespace App\Notifications;

use App\Models\Jobfair;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class JobfairCreated extends Notification
{
    use Queueable;

    protected $jobfair;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(Jobfair $jobfair)
    {
        $this->jobfair = $jobfair;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['broadcast', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'jobfair' => [
                'id' => $this->jobfair->id,
                'name' => $this->jobfair->name,
            ],
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'jobfair' => [
                'id' => $this->jobfair->id,
                'name' => $this->jobfair->name,
            ],
        ]);
    }
}
