<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class SlackService
{
    public function createChannel($name)
    {
        $name = str_replace([' ', '　'], '-', $name);
        try {
            $slacktoken = config('app.slack_token');

            return Http::withHeaders([
                'authorization' => "Bearer {$slacktoken}",
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
        $slacktoken = config('app.slack_token');
        try {
            return Http::withHeaders([
                'authorization' => "Bearer {$slacktoken}",
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
        $slacktoken = config('app.slack_token');
        try {
            return Http::withHeaders([
                'authorization' => "Bearer {$slacktoken}",
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
        $slacktoken = config('app.slack_token');

        try {
            Http::withHeaders([
                'authorization' => "Bearer {$slacktoken}",
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
        $slacktoken = config('app.slack_token');

        try {
            return Http::withHeaders([
                'authorization' => "Bearer {$slacktoken}",
            ])->post('https://slack.com/api/chat.postMessage', [
                'channel' => $channelId,
                'as_user' => 'U02MG72M8FL',
                'text' => "こちらはJobfair {$jfName}の情報交換を行うためのチャンネルです",
            ]);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th], 400);
        }
    }
}
