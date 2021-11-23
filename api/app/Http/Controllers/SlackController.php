<?php

namespace App\Http\Controllers;

use App\Models\Jobfair;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SlackController extends Controller
{
    public function createChannel($name)
    {
        $name = str_replace([' ', '　'], '-', $name);
        try {
            $slacktoken = config('slack_token');

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

    public function updateChannelId($name, $channelid)
    {
        $jf = Jobfair::where('name', '=', $name)->first();

        if ($jf) {
            $jf->channel_id = $channelid;
            $jf->save();

            return response()->json(['message' => 'Successfully'], 200);
        }

        return response()->json(['message' => 'Not find'], 400);
    }

    public function addUserToChannel(Request $request)
    {
        $channelid = Jobfair::where('id', '=', $request->JFid)->get(['channel_id']);

        $listMember = $request->assignee;

        foreach ($listMember as $member) {
            $slackid = User::where('id', '=', $member)->get(['chatwork_id']);
            $slacktoken = config('slack_token');

            try {
                Http::withHeaders([
                    'authorization' => "Bearer {$slacktoken}",
                ])->post('https://slack.com/api/conversations.invite', [
                    'channel' => $channelid[0]->channel_id,
                    'users' => $slackid[0]->chatwork_id,
                ]);
            } catch (\Throwable $th) {
                return response()->json(['message' => $th], 400);
            }
        }
    }

    public function addAdminToChannel(Request $request)
    {
        $channelid = Jobfair::where('name', '=', $request->JFName)->get(['channel_id']);
        $slackid = User::where('id', '=', $request->admin_id)->get('chatwork_id');
        $slacktoken = config('slack_token');

        try {
            Http::withHeaders([
                'authorization' => "Bearer {$slacktoken}",
            ])->post('https://slack.com/api/conversations.invite', [
                'channel' => $channelid[0]->channel_id,
                'users' => $slackid[0]->chatwork_id,
            ]);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th], 400);
        }
    }
}
