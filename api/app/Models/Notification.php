<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    // public function user()
    // {
    //     return $this->belongsTo(User::class);
    // }
<<<<<<< HEAD
    protected $casts = [
        'id' => 'string'
        ];
=======
>>>>>>> merge front and back J1

    public function notifiable()
    {
        return $this->morphTo();
    }

    public function subjectable()
    {
        return $this->morphTo();
    }

    

}
