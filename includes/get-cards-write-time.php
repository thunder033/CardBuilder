<?php
$ret = "NaN";

header("Content-type: text/json");
$ret = array();

$ret["timeStamp"] = $timeWritten = filemtime("cards.xml");
$t = (time() - $timeWritten);
$ret["timeString"] = "Last edited " . sprintf('%02d:%02d:%02d', ($t/3600),($t/60%60), $t%60) . " ago";
echo json_encode($ret);
?>