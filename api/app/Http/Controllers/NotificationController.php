<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Notifications\Notifiable;
use App\Models\Notification;
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
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($user_id)
    {

        // return Notification::where('notifiable_id','=',$notifiable_id)->with('user:id,name,avatar')->get();
        // $user = User::where('id','=',$user_id)->with('user:id,name,avatar')->get();
        $user = User::find($user_id);

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
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        
        return Notification::find($id)->update(['read_at'=> $request->only('read_at')]);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return Notification::find($id)->delete();
    }
    public function showUnread($notifiable_id)
    {

        // return Notification::where('user_id','=',$user_id)->where('read_at','=',null)->with('user:id,name,avatar')->get();
        $user = User::find($notifiable_id);

        return $user->unreadnotifications;
    }
    public function showNotificationUser($user_id,$notifiable_id)
    {

        return Notification::where('user_id','=',$user_id)->where('notifiable_id','=',$notifiable_id)->with('user:id,name,avatar')->get();
    }
    
    public function showNotificationUserUread($user_id,$notifiable_id)
    {

        return Notification::where('user_id','=',$user_id)->where('notifiable_id','=',$notifiable_id)->where('read_at','=',null)->with('user:id,name,avatar')->get();
    }
}
