<?php

namespace App\Controllers;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

class BaseHomeController extends BaseController
{
    public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger)
    {
        // Do Not Edit This Line
        parent::initController($request, $response, $logger);
        // Preload any models, libraries, etc, here.

        // E.g.: $this->session = \Config\Services::session();
    }

    public function setPages($layout = [], $data = [])
    {
        $device 			= ($this->agent->isMobile()) ? 'Mobile' : 'Pc';
        $viewHeaderSet 		= '/Layout/Header/';
        $subLayoutSet 		= '/Include/';
        $viewPageSet 		= '/Pages/';
        $viewFooterSet 		= '/Layout/Footer/';
        $viewArr 			= [];
        $viewArr[] 			= view("/Layout/HeaderOutline", $data);

        if (isset($layout['header']['name']) &&  is_file(APPPATH.'/Views/' .$viewHeaderSet.$layout['header']['name'].'.php')) {
            $opt =  (isset($layout['header']['opt']) && is_array($layout['header']['opt'])) ? $layout['header']['opt'] : [];
            $viewArr[] =  view($viewHeaderSet.$layout['header']['name'], $data, $opt);
        } else {
            $viewArr[] = view($viewHeaderSet."Header.php", $data);
        }

        if (isset($layout['subpage']['name']) &&  is_file(APPPATH.'/Views/' .$subLayoutSet.$layout['subpage']['name'].'.php')) {
            $viewArr[] =  view($subLayoutSet.$layout['subpage']['name'], $data);
        }

        if (isset($layout['pages'])) {
            if (!isset($layout['pages']['name'])) {
                foreach($layout['pages'] as $pkey => $pval) {
                    if ( ! is_file(APPPATH.'/Views/'.$viewPageSet.$pval['name'].'.php')) {
                        throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
                    } else {
                        $opt =  (isset($pval['opt']) && is_array($pval['opt'])) ? $pval['opt'] : [];
                        $viewArr[] = view($viewPageSet.$pval['name'], $opt);
                    }
                }
            } else {
                if ( ! is_file(APPPATH.'/Views/'.$viewPageSet.$layout['pages']['name'].'.php')) {
                    throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
                } else {
                    $opt =  (isset($layout['pages']['opt']) && is_array($layout['pages']['opt'])) ? $layout['pages']['opt'] : [];
                    $viewArr[] = view($viewPageSet.$layout['pages']['name'], $opt);
                }
            }

        } else {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
        }

        if (isset($layout['subpageClose']['name']) &&  is_file(APPPATH.'/Views/' .$subLayoutSet.$layout['subpageClose']['name'].'.php')) {
            $viewArr[] =  view($subLayoutSet.$layout['subpageClose']['name'], $data);
        }

        if (isset($layout['footer']['name']) &&  is_file(APPPATH.'/Views/' .$viewFooterSet.$layout['footer']['name'].'.php')) {
            $opt =  (isset($layout['footer']['opt']) && is_array($layout['footer']['opt'])) ? $layout['footer']['opt'] : [];
            $viewArr[] = view($viewFooterSet.$layout['footer']['name'], $data, $opt);
        } else {
            $viewArr[] = view($viewFooterSet.'Footer', $data);
        }

        $viewArr[] = view("/Layout/FooterOutline", $data);

        foreach ($viewArr as $view) {
            echo $view;
        }
    }
}
