<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=0,maximum-scale=1">

    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="imagetoolbar" content="no" />
    <meta http-equiv="expires" content="Mon, 06 Jan 1990 00:00:01 GMT" />
    <meta http-equiv="expires" content="-1" />
    <meta http-equiv="pragma" content="no-cache,must-revalidate" />
    <meta name="theme-color" content="#5F4B8B" />
    <meta name="mobile-web-app-capable" content="yes" />

    <title>Belrado</title>

    <link rel="stylesheet" href="/assets/css/common.css" />
    <link rel="stylesheet" href="/assets/css/roulette.css" />

    <?php if (isset($customCss)) : ?>
        <?php foreach ($customCss as $cssVal) : ?>
            <link rel="stylesheet" href="<?= $cssVal ?>" />
        <?php endforeach ?>
    <?php endif ?>

    <script src="/assets/js/jquery.min.js"></script>
    <script src="/assets/js/common.js"></script>
    <script src="/assets/js/AppCsrfAjax.js"></script>
    <script>
        var A_URL = "<?= site_url() ?>";
    </script>
</head>
