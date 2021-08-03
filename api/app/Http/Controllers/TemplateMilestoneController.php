<?php

namespace App\Http\Controllers;

use App\Models\TemplateMilestone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class TemplateMilestoneController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return TemplateMilestone::all();
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
            'name' => 'required|regex:/^[^\s]*$/|unique:template_milestones,name',
            'period' => 'required|numeric|min:1|max:3000',
            'is_week' => 'required|numeric|min:0|max:1',
        ];
        $validator = Validator::make($request->all(), $rules);
        $validator->validate();

        return TemplateMilestone::create($request->all());
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
            'id' => 'exists:App\Models\TemplateMilestone,id',
        ];
        $validator = Validator::make([
            'id' => $id,
        ], $rules);
        $validator->validate();

        return TemplateMilestone::find($id);
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
                Rule::unique('template_milestones')->whereNot('id', $id),
            ],
            'period' => 'numeric|min:1|max:3000',
            'is_week' => 'numeric|min:0|max:1',
        ];
        $validator = Validator::make($request->all(), $rules);
        $validator->validate();

        return TemplateMilestone::find($id)->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return TemplateMilestone::destroy($id);
    }

    public function checkUniqueEdit($id, $name)
    {
        return TemplateMilestone::where('id', '<>', $id)->where('name', '=', $name)->get();
    }

    public function checkUniqueAdd($name)
    {
        return TemplateMilestone::where('name', '=', $name)->get();
    }
}
