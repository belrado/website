<?php
namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\RESTful\ResourceController;

class BaseApiController extends BaseController
{
    protected array $returnData;

    public function __construct()
    {
        $this->returnData   = [
            'response'  => 'error',
            'msg'       => ''
        ];
    }

    protected function responseJsonStatus(Int $httpCode=200, $returnData = '') : Object
    {
        // $returnData = (!is_array($returnData)) ? $this->returnData : $returnData;
        return $this->response->setStatusCode($httpCode)
            ->setHeader('Cache-Control', 'no-cache')
            ->appendHeader('Content-Type', 'application/json')
            ->setJson($returnData);
    }


    protected function setErrorResponse($err_msg): array
    {
        return [
            'response'=>'error',
            'msg'=>$err_msg,
            csrf_token()=>csrf_hash()
        ];
    }
}



