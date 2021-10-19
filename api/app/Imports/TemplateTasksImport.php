<?php

namespace App\Imports;

use App\Models\TemplateTask;
use Maatwebsite\Excel\Concerns\ToModel;

class TemplateTasksImport implements ToModel
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        return new TemplateTask([
            'name' => $row[0],
            'description' => $row[1],
            'milestond_id' => $row[2],
            'is_day' => $row[3],
            'unit' => $row[4],
            'effort' => $row[5],

        ]);
    }
}
