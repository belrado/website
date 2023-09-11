<?php
namespace App\Controllers\Roulette;

use App\Controllers\BaseHomeController;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

class Main extends BaseHomeController
{
    public function __construct()
    {
    }


    public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger)
    {
        // Do Not Edit This Line
        parent::initController($request, $response, $logger);
        // Preload any models, libraries, etc, here.

        // E.g.: $this->session = \Config\Services::session();
    }

    protected function product($eventCoinLen) : array
    {
        $response = [
            'eventName' => [],
            'product' => []
        ];
       $info = [
           'opt_part1_coin' => '300',
           'opt_part2_coin' => '1000',
           'opt_part3_coin' => '5000',
           'opt_part4_coin' => '100000',
           'opt_part5_coin' => '500000',
       ];
        for ($i = 0; $i < $eventCoinLen; $i++) {
            $coin = $info['opt_part' . ($i + 1) . '_coin'];
            if ($coin > 10000) {
                $coin = "코인 " . substr($coin, 0, -4) . "만원";
            } else {
                $coin = "코인 " . number_format($coin) . "원";
            }
            $response['eventName'][$i] = $coin;
            $response['product'][$i] = [
                'name' => $coin,
                'coin' => $info['opt_part' . ($i + 1) . '_coin'],
            ];
        }
        return $response;
    }

    public function index()
    {

        $eventCoinLen = 5;
       // $deg = round(360 / $this->eventCoinLen, 4);

        $data['deg'] = round(360 / $eventCoinLen, 4);
        $data['eventNum'] = $eventCoinLen;
        $rData = $this->product($eventCoinLen);
        $data['roulette']['product'] = $rData['product'];
        $data['eventName'] = $rData['eventName'];
        $data['event_code'] = '1111';
        $data['roulette']['remain_event'] = 4;

        $layout = [
            'header' => ['name' => 'Header'],
            'pages'  => ['name' => 'Roulette'],
        ];

        $this->setPages($layout, $data);
    }
}
