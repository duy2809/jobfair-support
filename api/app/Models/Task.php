<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    public function milestone()
    {
        return $this->belongsTo(Milestone::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public function documents()
    {
        return $this->morphMany(Document::class, 'commentable');
    }

    public function categoryDetail()
    {
        return $this->morphOne(CategoryDetail::class, 'categoryDetailable');
    }
}
