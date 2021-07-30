<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Jobfair extends Model
{
    use HasFactory, SoftDeletes;

    public function schedule()
    {
        return $this->hasOne(Schedule::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'jobfair_admin_id');
    }
}
