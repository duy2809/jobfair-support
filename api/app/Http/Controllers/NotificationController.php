<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Task;
use App\Models\User;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
    }

    /**
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::find($id);
        return $user->notifications;
        
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update($id)
    {
        $date = Notification::find($id);
        $date->read_at = \Carbon\Carbon::now();
        $date->save();

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // return Notification::where('id', $id)->get();
        // return response()->json(['message' => 'Successed']);
        $noti = Notification::find($id);
        if (!$noti) {
            return response()->json();
        }

        $noti->delete();

        return response()->json(null);
        // return $noti;
    }

    public function showUnread($id)
    {
        $user = User::find($id);
        return $user->unreadNotifications;
    }

    public function updateAllRead($id)
    {
        $user = User::find($id);

        foreach ($user->unreadNotifications as $notification) {
            $notification->markAsRead();
        }
        
    }
}
