<?php

namespace App\Imports;

use App\Models\Category;
use App\Models\User;
use Hash;
use Maatwebsite\Excel\Concerns\ToModel;

class UsersImport implements ToModel
{
    private $categories;

    public function __construct()
    {
        $this->categories = Category::select('id', 'category_name')->get();
    }

    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        $arr = explode(',', $row[2]);
        $category = $this->categories->whereIn('category_name', $arr)->pluck('id');
        $newUser = User::create([
            'name'                  => trim($row[0]),
            'email'                 => trim($row[1]),
            'password'              => Hash::make('12345678'),
            'role' => 2,

        ]);
        $newUser->categories()->attach($category);

        return $newUser;
    }
}
