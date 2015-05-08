<?php
$ret = "no data";
if(isset($_POST['cards']))
{
    $ret = "data received";
    $xml = "<?xml version='1.0'?>\r\n";
    $xml .= "<cards>\r\n";
    foreach($_POST['cards'] as $id => $challenge)
    {
        list($content, $category) = array_map(trim, explode("|||", strip_tags($challenge,"<img><span>")));
        if(stristr($content, "<img") || stristr($content, "<span"))
        {
            $content = "<![CDATA[". $content . "]]>";
        }
        //preg_replace('/(xC2xA0/|&nbsp;)','', $challenge);
        $xml .= "<card id='{$id}' category='{$category}'>{$content}</card>\r\n";
    }
    $xml .= "</cards>\r\n";
    
    $handle = fopen("cards.xml", 'w');
    fwrite($handle, $xml);
    fclose($handle);
    $ret = "file saved";
}
echo $ret;
?>