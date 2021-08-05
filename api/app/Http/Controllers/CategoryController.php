<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = DB::table('categories')
            ->orderBy('id', 'asc')
            ->get();
        return Category::all();
    }

    public function search($key)
    {
        $categories = Category::select('*')->get();
        $query = strtolower($key);
        $categories = $categories->filter(function ($categories) use ($query) {
            if (Str::contains(strtolower($categories->category_name), $query)) {
                return true;
            }

            return false;
        });

        return $categories;
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
            'category_name' => 'required|max:255|unique:categories,category_name|regex:/^[^\s]*$/'
        ];
        $validator = Validator::make($request->all(), $rules);
        $validator->validate();
        return Category::create($request->all());
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Category::find($id);
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
            'category_name' => 'max:255|unique:categories,category_name|regex:/^[^\s]*$/'
        ];
        $validator = Validator::make($request->all(), $rules);
        $validator->validate();
        return Category::find($id)->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return Category::destroy($id);
    }
}
