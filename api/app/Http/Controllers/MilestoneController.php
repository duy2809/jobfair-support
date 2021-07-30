<?php

namespace App\Http\Controllers;

use App\Models\Milestone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class MilestoneController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Milestone::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $rules = [
            'name' => 'required|regex:/^[^\s]*$/',
            'name' => Rule::unique('milestones')->where('schedule_id', request('schedule_id')),
            'period' => 'required|numeric|min:1|max:3000',
            'schedule_id' => 'required|numeric|exists:App\Models\Schedule,id',
            'is_week' => 'required|numeric|min:0|max:1',
        ];
        $validator = Validator::make($request->all(), $rules);
        $validator->validate();

        return Milestone::create($request->all());
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $rules = [
            'id' => 'exists:App\Models\Milestone,id',
        ];
        $validator = Validator::make([
            'id' => $id,
        ], $rules);
        $validator->validate();

        return Milestone::find($id);
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
        $rules = [
            'name' => 'regex:/^[^\s]*$/',
            'name' => [
                Rule::unique('milestones')->where('schedule_id', Milestone::where('id', $id)->pluck('schedule_id')[0])
                    ->whereNot('id', $id),
            ],
            'period' => 'numeric|min:1|max:3000',
            'schedule_id' => 'numeric|exists:App\Models\Schedule,id',
            'is_week' => 'numeric|min:0|max:1',
        ];
        $validator = Validator::make($request->all(), $rules);
        $validator->validate();

        return Milestone::find($id)->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return Milestone::destroy($id);
    }
}