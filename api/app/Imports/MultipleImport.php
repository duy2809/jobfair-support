<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class MultipleImport implements WithMultipleSheets 
{
   
    public function sheets(): array
    {
        return [
            new TemplateTasksImport(),
            new SchedulesImport()
        ];
    }
}