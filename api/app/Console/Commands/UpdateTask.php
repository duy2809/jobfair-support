<?php

namespace App\Console\Commands;

use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskExpired;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

class UpdateTask extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'task:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This will update status task';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $tasks = Task::where('status', '<>', '未完了')->get();
        $user = User::where('role', 1)->get();
        foreach ($tasks as $task) {
            $task->whereDate('end_time', '<', now()->toDateString())->update(['status' => '未完了']);
            Notification::send(
                $task->users()->get(),
                new TaskExpired($task, $user[0])
            );
        }
    }
}
