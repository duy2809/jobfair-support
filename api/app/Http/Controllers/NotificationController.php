<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
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
    public function show($notifiable_id)
    {

<<<<<<< HEAD
        return Notification::where('notifiable_id','=',$notifiable_id)->with('user:id,name,avatar')->get();
=======
        return Notification::where('notifiable_id','=',$notifiable_id)->get();
>>>>>>> push data seeder notification table
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
<<<<<<< HEAD
        return Notification::find($id)->delete();
=======
        //
>>>>>>> push data seeder notification table
    }
    public function showUnread($notifiable_id)
    {

<<<<<<< HEAD
        return Notification::where('notifiable_id','=',$notifiable_id)->where('read_at','=',null)->with('user:id,name,avatar')->get();
=======
        return Notification::where('notifiable_id','=',$notifiable_id)->where('read_at','=',null)->get();
>>>>>>> push data seeder notification table
    }
    public function showNotificationUser($notifiable_id, $user_id)
    {

<<<<<<< HEAD
        return Notification::where('notifiable_id','=',$notifiable_id)->where('user_id','=',$user_id)->with('user:id,name,avatar')->get();
=======
        return Notification::where('notifiable_id','=',$notifiable_id)->where('user_id','=',$user_id)->get();
>>>>>>> push data seeder notification table
    }
    // public function showNotificationUser( Request $request,$notifiable_id)
    // {

    //     return Notification::where('notifiable_id','=',$notifiable_id)->where('user_id','=',$request->user_id)->get();
    // }
    public function showNotificationUserUread($notifiable_id, $user_id)
    {

<<<<<<< HEAD
        return Notification::where('notifiable_id','=',$notifiable_id)->where('user_id','=',$user_id)->where('read_at','=',null)->with('user:id,name,avatar')->get();
=======
        return Notification::where('notifiable_id','=',$notifiable_id)->where('user_id','=',$user_id)->where('read_at','=',null)->get();
>>>>>>> push data seeder notification table
    }
}
