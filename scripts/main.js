//BUG REPORT
/*
	? + ? = 8  (Ili bilo koji drugi parni rezultat.)
	Ako dva put klikneš isto polje (4), to registrira kao da si dobro izračunao
	i samo jedno polje se zatvori. :)
*/

$(document).ready(function(){
    
    play();
      
});

// globalne 
var interval;
var start_time = 30; // time from which timer starts counting

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
		alert('Game over');
        //play();
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
	
    //Test run
    if(Math.ceil(Math.random() * 2) == 2) {
        operand = '+';
    } else {
        operand = '-';
    }
    var result = generateGrid( 6, 10, operand);
    
    /// generating the grid
	/*
		result.fields.length keširati
		var fieldsLength = fields.length - inače svaki prolazak kroz petlju treba računati veličinu arraya
	*/
	var html = '<table><tbody><tr>';
    for (var i=0; i < result.fields.length; i++) {
        attr = 'cell';
       
        //html += '<div id="cell' + (i+1) +'" class="' + attr + '">' + result.fields[i] + '</div>\n';
		html += '<td id="cell' + (i+1) +'">' + result.fields[i] + '</td>\n';
		
		 if ( (i + 1) % 6 == 0 ) {
			html += '</tr><tr>';
		}
    }
	
	html += '</tr></tbody></table>'
	
	/*
		Multiple dom manipulacije - sve u jednom potezu napraviti.
		Možda injectati kompletni html preko js-a
	*/
    $('#grid').append(html);
    $('#operation').append(result.operation); 
    $('#result').append(result.result);
    
    // core gaming
    timer(0);

    interval = setInterval(function(){ timer(-1); }, 1000);
	
    var check   = false,
		first   = 0,
		second  = 0,
		firstID = '',
		secondID= '';
    
	//Cache often used selectors.
	var animationTimeout = 200,
		$first = $('#first'),
		$second = $('#second');
	
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
                if (tempResult == result.result && firstID != secondID) {
					
					$('#' + firstID + ', #' + secondID)
						.html('X')
						.addClass('success');
					
					//Timeout to allow success animation to finish.
					setTimeout(function(){ 
						
						$('#' + firstID + ', #' + secondID)
							.removeClass('success active')
							.addClass('completed'); 
						
					}, animationTimeout);
					
                    timer(3); // bonus
					
                } else {
				
                    timer(-3); // punishment
					
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
function generateGrid( gridDimension, maxValue, operation ) {

    
    var grid = {
                    //Get random value for the result, based on maxValue
                    result : Math.ceil( Math.random() * maxValue ),

                    size : (gridDimension * gridDimension),
                    
                    fields : [],
                    
                    operation : operation || '+'
        },
        
        tempItem     = '';
    
    
    //So that the problem doesn't become too easy to solve
    if( grid.result < 8 ) grid.result += 6;
    
    //Generating values for all fields in grid.
    //Each pass generates 2 field values that when calculated give the result.
    while( grid.size ){
        
        //Generate first random value
        tempItem = Math.ceil( Math.random() * grid.result );
        
        //Pair value is calculated based on operation
        if( grid.operation == '+'){
            
            grid.fields.push( tempItem );
            grid.fields.push( grid.result - tempItem );
            
        }else{
            
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