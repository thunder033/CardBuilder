<!DOCTYPE html>
<html>
    <head>
        <title>Garage Band Cards</title>
        <link rel="stylesheet" type="text/css" href="css/card-builder.css">
        <script src="http://code.jquery.com/jquery-2.1.3.min.js"></script>
        <script src="js/card-builder.js"></script>
    </head>
    <body>
        <span id="cards-idle-elapsed"></span>
        
        <header></header>
        
        <section id="cards" class="print">
            <input type="checkbox" class="back" id="toggle">
            <label for="toggle">Show Back</label>
            
            <input type="checkbox" class="duplex" id="duplex-toggle" style="left: 13em">
            <label for="duplex-toggle" style="left: 13.5em">Auto Duplex Print</label>
    
            <?php
                $XMLString = str_replace("&nbsp;", " ", file_get_contents("includes/cards.xml"));
                $xml = new SimpleXMLElement($XMLString);
                
                $colors = array(
                    "Rock","Pop","Rap/Hip-hop","Country","Dance","Metal","Miscalleneous"
                    );
                
                foreach($xml->card as $card)
                {
                    $id = $card['id'];
                    $cat = $card['category'];
                    $text = $card;
                    echo <<<HTML
            <div id="{$id}" class="card print" data-category="$cat"><div contenteditable="true" class="content print">$text</div></div>
HTML;
                }
            ?>
            <div id="new-card">New Card</div>
        </section>
    </body>
</html>