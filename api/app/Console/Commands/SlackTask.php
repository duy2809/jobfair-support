<?php

namespace App\Console\Commands;

use App\Models\Jobfair;
use App\Models\Task;
use App\Models\User;
use App\Services\SlackService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SlackTask extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'task:slack';

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
    protected $slack;

    public function __construct(SlackService $slack)
    {
        parent::__construct();
        $this->slack = $slack;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $url = config('app.url');
        $tasksEnd = Task::whereIn('status', ['未着手', '進行中'])
            ->whereDate('end_time', '=', now()->toDateString())->get();
        foreach ($tasksEnd as $task) {
            $userId = $task->users->pluck('id')->toArray();
            $jobfairId = $task->schedule->jobfair->id;
            $channelId = Jobfair::where('id', '=', $jobfairId)->get(['channel_id']);
            $slackId = [];
            foreach ($userId as $user) {
                $slack = User::where('id', '=', $user)->get(['chatwork_id']);
                $slackId[] = $slack[0]->chatwork_id;
            }

            $listUserId = implode('>さん,<@', $slackId);
            $text = "<@{$listUserId}>さん\n期限が今日までのタスクがあります\nタスク：{$task->name}\nリンク：{$url}/task-detail/{$task->id}\n確認してください";
            $this->slack->dailyBot($text, $channelId[0]->channel_id);
        }

        $tasksStart = Task::whereIn('status', ['未着手', '進行中'])
            ->whereDate('start_time', '=', now()->toDateString())->get();
        foreach ($tasksStart as $task) {
            $userId = $task->users->pluck('id')->toArray();
            $jobfairId = $task->schedule->jobfair->id;
            $channelId = Jobfair::where('id', '=', $jobfairId)->get(['channel_id']);
            $slackId = [];
            foreach ($userId as $user) {
                $slack = User::where('id', '=', $user)->get(['chatwork_id']);
                $slackId[] = $slack[0]->chatwork_id;
            }

            $listUserId = implode('>さん,<@', $slackId);
            $text = "<@{$listUserId}>さん\n今日始めるタスクがあります\nタスク：{$task->name}\nリンク：{$url}/task-detail/{$task->id}\n確認してください";
            $this->slack->dailyBot($text, $channelId[0]->channel_id);
        }

        $tasksOver = Task::whereIn('status', ['未完了'])
            ->whereDate('end_time', '=', Carbon::yesterday()->toDateString())->get();
        foreach ($tasksOver as $task) {
            $jobfairId = $task->schedule->jobfair->id;
            $channelId = Jobfair::where('id', '=', $jobfairId)->get(['channel_id']);
            $adminId = $task->schedule->jobfair->jobfair_admin_id;
            $slackId = User::where('id', '=', $adminId)->get(['chatwork_id']);
            $text = "<@{$slackId[0]->chatwork_id}>さん\n今日から期限が切れたタスクがあります\nタスク：{$task->name}\nリンク：{$url}/task-detail/{$task->id}\n確認してください";
            $this->slack->dailyBot($text, $channelId[0]->channel_id);
        }
    }
}
