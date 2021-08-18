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

         // return Notification::where('notifiable_id','=',$user_id)->get();
         $noti = Notification::orderBy('created_at', 'ASC')->where('notifiable_id','=',$user_id)->get();
         if (count($noti) == 0) {
             return 0;
        } else {
                // $user = Notification::orderBy('created_at', 'ASC')->select('user_id')->where('notifiable_id','=',$user_id)->get();
                foreach ($noti as $notification) {
                 // $nameUser[] = User::select('name')->where('id','=',$notification->user_id)->get();
                //  $nameUser[] =User::select('name')->where('id','=',$notification->user_id)->get();
                 $nameUser[] =User::select('name')->find($notification->user_id);
             
             }
     
             // return $user->notifications;
             return response()->json(['userName' => $nameUser, 'noti' => $noti]);
            //  return $user;
             
         }
       
         
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
        // return Notification::where('id', $id)->get();
        // return response()->json(['message' => 'Successed']);
        $noti = Notification::find($id);
        if($noti)
            $noti->delete(); 
        else
            return response()->json(error);
        return response()->json(null); 
        // return $noti;
     }
    public function showUnread($user_id)
    {

        // return Notification::where('user_id','=',$user_id)->where('read_at','=',null)->with('user:id,name,avatar')->get();
        // $user = User::find($user_id);

        // return $user->unreadnotifications;
        $noti = Notification::orderBy('created_at', 'ASC')->where('notifiable_id','=',$user_id)->where('read_at','=',null)->get();
         if (count($noti) == 0) {
             return 0;
        } else {
                foreach ($noti as $notification) {
                 $nameUser[] =User::select('name')->find($notification->user_id);
             
             }
     
             return response()->json(['userName' => $nameUser, 'noti' => $noti]);
             
         }
    }
   
}
