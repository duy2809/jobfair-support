<?php

namespace App\Http\Controllers;

use App\Models\Jobfair;
use Illuminate\Http\Request;

class JFListController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Jobfair::join('users', 'jobfairs.jobfair_admin_id', '=', 'users.id')
            ->select('jobfairs.*', 'users.name as admin')
            ->orderBy('jobfairs.created_at', 'DESC')
            ->get();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
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
    public function update(Request $request, $id)
    {
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Jobfair::withTrashed()->where('id', $id)->delete();

        return Jobfair::join('users', 'jobfairs.jobfair_admin_id', '=', 'users.id')
            ->select('jobfairs.*', 'users.name as admin')
            ->orderBy('jobfairs.created_at', 'DESC')
            ->get();
    }
}