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
            'description_of_detail' => $row[2],
            'milestonn_id' => $row[3],
            'is_day' => $row[4],
            'unit' => $row[5],
            'effort' => $row[6],

        ]);
    }
}
