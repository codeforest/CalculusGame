$(document).ready(function(){
    
    play();
      
});

// global variables for the game
var interval,
	start_time = 30, // time from which timer starts counting
	bonusTime = 3, // bonus seconds for correct answer
	punishmentTime = 3, // punishment seconds for wrong answer 
	gridSize = 6, // should be an even number
	maxValue = 10; // max result value

	if (gridSize % 2 != 0) {
		gridSize += 1; // if someone did not put an even number, correct it!
	}

/**
*  Time 
*/
function timer(increment) {
	
	var $timer = $('#timer');
	
    if(increment == 0) {
        timer_start = start_time;
    }
	
    timer_start += increment;
    $timer.html(timer_start);
	
	// some colors on the timer
	if( timer_start < 4 ) {

		$timer
			.removeClass('warning')
			.addClass('danger');
	
	} else if( timer_start < 8 ) {
	
		$timer
			.addClass('warning');
	
	} else {
		
		$timer.
			removeClass('warning danger');
	
	}
	
	
	if(timer_start < 1) {
        reset();
        play();
    } 
}

function reset(){
    $('#grid, #operation, #result').html('');
    $('#first, #second').html('?');
    clearInterval(interval);    
}



/**
* Main method for playing
*/
function play() {
	
	// choose operation randomly
    if (Math.ceil(Math.random() * 2) == 2) {
        operand = '+';
    } else {
        operand = '-';
    }
    // generating our grid
    var result = generateGrid( gridSize, maxValue, operand);
    
    // filling the table with grid values
    var html = '<table><tbody><tr>',
	fieldsLength = result.fields.length;
    for (var i=0; i < fieldsLength; i++) {
        attr = 'cell';

		html += '<td id="cell' + (i+1) +'">' + result.fields[i] + '</td>\n';
		
		 if ( (i + 1) % gridSize == 0 ) {
			html += '</tr><tr>';
		}
    }
	
	html += '</tr></tbody></table>'
	
	//this will be better solved next time :)
    $('#grid').append(html);
    $('#operation').append(result.operation); 
    $('#result').append(result.result);
    
    // core gaming
    timer(0);

    // setting the interval to 1 second
    interval = setInterval(function(){ timer(-1); }, 1000);
	
    var check   = false,
		first   = 0,
		second  = 0,
		firstID = '',
		secondID= '';
    
	//Cache often used selectors.
	var animationTimeout = 200,
		$first = $('#first'),
		$second = $('#second'),
		hasWon = (gridSize * gridSize) / 2,
		correctPairs = 0;
	
	$('#grid').find('td').each(function() {
	
        $(this).click(function(){
			
            if(!check) {
			
                first = $(this).html();
				$(this).addClass('active');
                $first.html(first);
                firstID = $(this).attr('id');
                check = true;
				
            } else {
			
                second = $(this).html();
                $second.html(second);
                secondID = $(this).attr('id');
				
                if(result.operation == '+') {
				
                    tempResult = parseInt(first) + parseInt(second);
					
                } else {
				
                    tempResult = parseInt(first) - parseInt(second);
					
                }
				
                // correct
                if (tempResult == result.result && firstID != secondID) { // also checking for 2 clicks on the same cell
					
					$('#' + firstID + ', #' + secondID)
						.html('X')
						.addClass('success');
					
					//Timeout to allow success animation to finish.
					setTimeout(function(){ 
						
						$('#' + firstID + ', #' + secondID)
							.removeClass('success active')
							.addClass('completed'); 
						
					}, animationTimeout);
					
                    timer(bonusTime); // bonus time

                    // incrementing number of correct pairs
                    correctPairs += 1;
                    // did we won the game?
                    if (correctPairs == hasWon) { //yes, we did!!!
                    	reset();
                    	alert('You won the game!');
                    }
					
                } else {
				
                    timer(-punishmentTime); // punishment
					
					$('#' + firstID + ', #' + secondID)
						.addClass('active error');
						
					setTimeout(function(){ 
						
						
						$('#' + firstID + ', #' + secondID)
							.removeClass('error active'); 
						
					
					}, animationTimeout);
					
                    check = false;
					
                }
				
                $second.html('?');
                $first.html('?');
                check = false;
            }    
        });    
    });
}
        
//gridDimension - dimension of the grid (if 6 is entered, grid will be 6*6)
//maxValue - max value for the result. Should not be less than 8.
//operation - '+' or '-', the value is optional, if not entered, operation will be addition (+)
// this function was first developed by Zoran Jambor - Thanks
function generateGrid( gridDimension, maxValue, operation ) {

    if (gridDimension % 2 != 0) {
    	gridDimension += 1; // as gridDimension can only be an even number
    }
    var grid = {
                    //Get random value for the result, based on maxValue
                    result : Math.ceil( Math.random() * maxValue ),

                    size : (gridDimension * gridDimension),
                    
                    fields : [],
                    
                    operation : operation || '+'
        },
        
        tempItem     = '';
    
    
    //So that the problem doesn't become too easy to solve
    if ( grid.result < 8 ) grid.result += 6;
    
    //Generating values for all fields in grid.
    //Each pass generates 2 field values that when calculated give the result.
    while ( grid.size ){
        
        //Generate first random value
        tempItem = Math.ceil( Math.random() * grid.result );
        
        //Pair value is calculated based on operation
        if ( grid.operation == '+'){
            
            grid.fields.push( tempItem );
            grid.fields.push( grid.result - tempItem );
            
        } else {
            
            tempItem += grid.result;
            grid.fields.push( tempItem );
            grid.fields.push( tempItem - grid.result);
        
        }
        
        grid.size -= 2;
            
    }
    
    //Randomize the field values
    grid.fields.sort( function(){return 0.5 - Math.random()} );
    
    return grid;

}