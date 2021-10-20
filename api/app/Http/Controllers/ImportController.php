<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\MultipleImport;

class ImportController extends Controller
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function fileImportExport()
    {
       return view('file-import');
    }
   
    /**
    * @return \Illuminate\Support\Collection
    */
    public function fileImport(Request $request) 
    {
        $path1 = $request->file('file')->store('temp'); 
        $path=storage_path('app').'/'.$path1; 
        Excel::import(new MultipleImport, $path);
        return response()->json(1);
        
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function fileExport() 
    {
        return Excel::download(new TemplateTasksImport, 'users-collection.xlsx');
    }    
}