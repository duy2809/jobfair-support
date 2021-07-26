<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WebInit extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        return [
            'auth' => $this->getAuth($request),
        ];
    }

    protected function getAuth(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return null;
        }

        return [
            'user' => $user,
        ];
    }
}
