<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jobfair extends Model
{
    use HasFactory;
    public $timestamps = false;
   
    public function schedule() {
        return $this->hasOne(Schedule::class);
    }

}
