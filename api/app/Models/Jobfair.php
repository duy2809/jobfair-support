<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jobfair extends Model
{
    use HasFactory;

    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }
}
