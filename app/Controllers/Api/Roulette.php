<?php
namespace App\Controllers\Api;

use App\Controllers\Api\BaseApiController;

class Roulette extends BaseApiController
{
    public function run(): object
    {
        $this->returnData['response'] = "success";
        $this->returnData['win_coin'] = rand(0, 4);

        return $this->responseJsonStatus(200, $this->returnData);
    }
}
