//variables to store answers
let answerOne,
    answerTwo,
    answerThree;

function pickedWheat(){
    answerOne = ['WH', 'wheat', '0']
    ontoQuestionTwo()
}
function pickedRice(){
    answerOne = ['RI','rice', '1']
    ontoQuestionTwo()
}
function pickedMaize(){
    answerOne = ['MZ', 'maize', '2']
    ontoQuestionTwo()
}

function picked2050(){
    answerTwo = '2050'
    ontoQuestionThree()
}

function picked2080(){
    answerTwo = '2080'
    ontoQuestionThree()
}

function pickedA1 (){
    answerThree = 'A1F1'
    surveyCompleted()
}

function pickedA2 (){
    answerThree = 'A2a'
    surveyCompleted()
}

function pickedB1 (){
    answerThree = 'B1a'
    surveyCompleted()
}

function pickedB2 (){
    answerThree = 'B2a'
    surveyCompleted()
}

function ontoQuestionTwo(){
    $("#surveyQuestion").html('<b> What year to you think will experience a notable change in crop production first?</b>');

    $('#surveyOptions').html('<div class="col">\n' +
        '                            2050 <br>\n' +
        '                            <input type="image" src="img/2050.png" alt="Submit" width="150" height="100" onclick="picked2050()">\n' +
        '                        </div>\n' +
        '                        <div class="col">\n' +
        '                            2080 <br>\n' +
        '                            <input type="image" src="img/2080.png" alt="Submit" width="150" height="100" onclick="picked2080()">\n' +
        '                        </div>\n');
}

function ontoQuestionThree(){
    $("#surveyQuestion").html('<b> Which of the following scenarios of future global developments do you consider the most likely?</b>');

    $('#surveyOptions').html('<div class="col">\n' +
                                    '<input type="image" src="img/a1.png" alt="Submit" width="170" height="170" onclick="pickedA1()"> <br>\n' +
        '                            Convergence among regions and increased interactions with an economy based on rapid growing technological advancement' +
        '                        </div>\n' +
        '                        <div class="col">\n' +
                                    '<input type="image" src="img/b1.png" alt="Submit" width="200" height="170" onclick="pickedB1()"> <br>\n' +
        '                            Convergence among regions and increased interactions with an economy shifting into service, information and sustainability' +
        '                        </div>\n' +
        '                        <div class="col">\n' +
                                    '<input type="image" src="img/a2.png" alt="Submit" width="170" height="170" onclick="pickedA2()"> <br>\n' +
        '                            Fragmented regions that emphasize on self-reliance and local identities with an economy based on rapid growing technological advancement' +
        '                        </div>\n' +
        '                        <div class="col">\n' +
        '                            <input type="image" src="img/b2.png" alt="Submit" width="200" height="170" onclick="pickedB2()"> <br>\n' +
        '                            Fragmented regions that emphasize on self-reliance and local identities with an economy shifting into service, information and sustainability' +
        '                        </div>\n');
}

function startOver(){
    answerOne, answerTwo, answerThree = '';
    $("#surveyQuestion").html('<b>Which of the following crops would you say plays the biggest role in your diet?</b>');

    $('#surveyOptions').html('<div class="col">\n' +
        '                            Wheat <br>\n' +
        '                            <input type="image" src="img/wheat.png" alt="Submit" width="150" height="150" onclick="pickedWheat()">\n' +
        '                        </div>\n' +
        '                        <div class="col">\n' +
        '                            Maize <br>\n' +
        '                            <input type="image" src="img/maize.png" alt="Submit" width="150" height="150" onclick="pickedMaize()">\n' +
        '                        </div>\n' +
        '                        <div class="col">\n' +
        '                            Rice <br>\n' +
        '                            <input type="image" src="img/rice.png" alt="Submit" width="150" height="150" onclick="pickedRice()">\n' +
        '                        </div>')

    $('#surveyResults').html('<b> You did not complete the survey so please read the filter descriptions in order to\n' +
        '                                        create different maps to explore. Click on the countries for more information. </b>')
}

function surveyCompleted(){
    let answer = answerOne[0] + answerThree + answerTwo;
    $('#surveyResults').html("Your survey results indicate that you would be most interested in the " + '<b><i>' + answer +
        '</i></b> projection. Which is the change in the <b><i>' + answerOne[1] + "</i></b> crop for <b><i> " + answerTwo + ' </i></b> following the SRES <b><i>' + answerThree
        + '</i></b> scenario. Change the filters to explore different maps and click on individual countries for more information.');
    $('#V1year').val(answerTwo);
    $('#V1projection').val(answerThree);
    $('#V1crop').val(answerOne[2]);
    map.surveyInitialization();
    fullpage_api.moveSectionDown();

}
