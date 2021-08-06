<?php

namespace PlumpBoy\FileManager\Handlers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Http\File as LaravelFile;
use App\Libraries\FileManager\FileHandlerContract;
use App\Models\File;
use App\Repositories\FileRepositoryInterface;
use Intervention\Image\Facades\Image as ImageEditor;
use DB;

class Image extends FileHandlerContract
{
    protected $rules = 'mimes:jpeg,jpg,png,gif|required';
    protected $type = 'image';

    /**
     * resize data.
     *
     * @var string
     */
    protected $resize = [];

    protected function put($file, $path, $options)
    {
        $this->setUploadData($file, $path);

        $storeImage = $file;

        if ($this->resize != [] && count($this->resize) === 2) {
            $image = ImageEditor::make($file->getRealPath());

            $image->resize($this->resize[0], $this->resize[1], function ($constraint) {
                $constraint->aspectRatio();
            })->save();

            $storeImage = new LaravelFile($image->dirname . '/' . $image->basename);
        }

        if ($this->driver()->putFileAs($path, $storeImage, $this->data['id'], $options)) {
            return File::create($this->data);
        }

        return false;
    }

    public function resize($width, $height)
    {
        $this->resize = [$width, $height];

        return $this;
    }
 }