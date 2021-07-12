<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemplateDocument extends Model
{
    use HasFactory;

    public function templateDocumentable()
    {
        return $this->morphTo();
    }
}
