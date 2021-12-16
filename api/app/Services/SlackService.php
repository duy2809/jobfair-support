<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class SlackService
{
    protected $slacktoken;
    protected $workspace;

    public function __construct()
    {
        $this->slacktoken = config('app.slack_token');
        $this->workspace = config('app.workspace_id');
    }

    public function createChannel($name)
    {
        $name = str_replace([' ', '　'], '-', $name);
        try {
            return Http::withHeaders([
                'authorization' => "Bearer {$this->slacktoken}",
            ])->post('https://slack.com/api/conversations.create', [
                'name' => $name,
                'is_private' => 'true',
            ]);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th], 400);
        }
    }

    public function addUserToChannel($channelId, $listSlackId)
    {
        try {
            return Http::withHeaders([
                'authorization' => "Bearer {$this->slacktoken}",
            ])->post('https://slack.com/api/conversations.invite', [
                'channel' => $channelId,
                'users' => $listSlackId,
            ]);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th], 400);
        }
    }

    public function addAdminToChannel($dataAdminToChannel)
    {
        try {
            return Http::withHeaders([
                'authorization' => "Bearer {$this->slacktoken}",
            ])->post('https://slack.com/api/conversations.invite', [
                'channel' => $dataAdminToChannel[0],
                'users' => $dataAdminToChannel[1],
            ]);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th], 400);
        }
    }

    public function assignTaskBot($text, $channelId)
    {
        try {
            Http::withHeaders([
                'authorization' => "Bearer {$this->slacktoken}",
            ])->post('https://slack.com/api/chat.postMessage', [
                'channel' => $channelId,
                'as_user' => 'U02MG72M8FL',
                'text' => $text,
            ]);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th], 400);
        }
    }

    public function createChannelBot($jfName, $channelId)
    {
        try {
            return Http::withHeaders([
                'authorization' => "Bearer {$this->slacktoken}",
            ])->post('https://slack.com/api/chat.postMessage', [
                'channel' => $channelId,
                'as_user' => 'U02MG72M8FL',
                'text' => "こちらはJobfair {$jfName}の情報交換を行うためのチャンネルです",
            ]);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th], 400);
        }
    }

    public function dailyBot($text, $channelId)
    {
        try {
            Http::withHeaders([
                'authorization' => "Bearer {$this->slacktoken}",
            ])->post('https://slack.com/api/chat.postMessage', [
                'channel' => $channelId,
                'as_user' => 'U02MG72M8FL',
                'text' => $text,
            ]);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th], 400);
        }
    }

    public function checkInWorkspace($user_id)
    {
        try {
            return Http::withHeaders([
                'authorization' => "Bearer {$this->slacktoken}",
            ])->get('https://slack.com/api/users.conversations', [
                'team_id' => $this->workspace,
                'user' => $user_id,
            ]);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th], 400);
        }
    }

    public function getInfoChannel($channel_id)
    {
        try {
            return Http::withHeaders([
                'authorization' => "Bearer {$this->slacktoken}",
            ])->get('https://slack.com/api/conversations.info', [
                'channel' => $channel_id,
            ]);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th], 400);
        }
    }

    public function changeNameChannel($channel_id, $name)
    {
        try {
            return Http::withHeaders([
                'authorization' => "Bearer {$this->slacktoken}",
            ])->post('https://slack.com/api/conversations.rename', [
                'channel' => $channel_id,
                'name' => $name,
            ]);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th], 400);
        }
    }
}
