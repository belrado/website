<style>
    .roulette-box .event-content .event-text {
        /*
        width:100%;
        height:100%;
        left:0;
        top:0;
        z-index:11;
        font-size:20px;
        text-align:center;
        transform: rotate(<?=($deg/2)?>deg);
    */
    }
    .roulette-box .event-content::after {
        -webkit-transform: rotate(<?=$deg?>deg);
        transform: rotate(<?=$deg?>deg);
    }
    <?php
    for ($i=0; $i<$eventNum; $i++) : ?>
    .roulette-box .event-content:nth-child(<?=($i+1)?>) {
        -webkit-transform: rotate(<?=($i*$deg)?>deg);
        transform: rotate(<?=($i*$deg)?>deg);
    }
    <?php endfor ?>
</style>
<div class="wrapper-rullet">
    <div class="inner-box-rullet">
        <div class="rullet-background">
            <div class="rullet-event-text p30b">
                <img src="/assets/image/mobile/event/rullet_title.png" alt="arrow" class="rullet-img">
            </div>
            <div class="rullet-event">
                <div class="roulette-container">
                    <div class="roulette-box">
                        <div class="win-arrow"></div>
                        <div class="roulette-layer">
                            <div class="roulette">
                                <?php /* for($i=($eventNum-1); $i>=0; $i--)*/
                                for ($i=0; $i<$eventNum; $i++) : ?>
                                    <div class="event-content event-content<?=($i+1)?>">
                                        <span class="event-text"><?=$roulette['product'][$i]['name']?></span>
                                    </div>
                                <?php endfor ?>
                            </div>
                        </div>
                        <div class="text-box">
                            <img src="/assets/image/mobile/event/roulette/text.png" alt="100%당첨">
                        </div>
                        <div class="left-coin-box"></div>
                        <div class="right-coin-box"></div>
                        <button class="start-btn" id="rouletteStart" data-eventcode="<?=esc($event_code)?>">시작</button>
                    </div>
                </div>
                <div class="rullet-btl-content">

                </div>
                <div>
                    <p class="roulette-text" style="color: #000"><span id="remain_event_num"><?= $roulette['remain_event'] ?></span>회</p>
                </div>
                <div class="top-desc-text">
                    <p>
                        이벤트 기간 중 <strong>홍카페 앱</strong>에서 진행되는
                        <br>
                        룰렛 이벤트에 참여해서 <strong>보너스 코인</strong>을 얻어가세요!
                    </p>
                </div>
            </div>
        </div>
        <div class="rullet-bottom-img" style="padding: 0 0 50px 0">
            <img src="/assets/image/mobile/event/rullet_bottom.jpg" alt="arrow" class="rullet-img">
        </div>
    </div>
</div>

<script src="/assets/js/app_roulette.js?<?=time()?>"></script>
<script>
    /* roulette */
    $(document).ready(function() {
        var myRoulette          = new Roulette();
       // myRoulette.winType = false;
        myRoulette.url          = "/api/roulette/run";
        myRoulette.eventName    = <?=json_encode($eventName)?>;
        myRoulette.eventNum     = "<?=$eventNum?>";
        myRoulette.remainNum    = "<?= $roulette['remain_event'] ?>";
        myRoulette.init();
    });
</script>
