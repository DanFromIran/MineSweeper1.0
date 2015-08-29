var d;
var imgSrc;
var rows;
var cols;
var allBombs= [];
var allCells = [];
var processedSoFar=0;
var gameOver=false;

var Cell = function(x , y)
{
	this.rowval=x;
	this.colval=y;
	this.hasBomb=false;
	this.processed=false;
	this.bombsAround=0;
	this.flagged = false; 
}


window.onload = function(){

  d = document.getElementById("debug");
  imgSrc = ["revealed.png", "one.png", "two.png", "three.png", "four.png"
,"five.png", "six.png", "seven.png", "eight.png"];

  rows = 10;
  cols = 10;
  bombNum=12;

 var pp = document.getElementById("allCells");
	for(var i =0; i<rows; i++)
	{
		var ii = document.createElement("div");
	  		for(var j=0; j<cols; j++)
	  		{
	  			var jj = document.createElement("img");
	  			jj.src = "hidden.png" ; 
	  			jj.id = i + "," +j;
	  			jj.dataset.row= i; 
	  			jj.dataset.column = j;
	  			jj.onclick = reveal;
	  			
	  			ii.appendChild(jj);

	  		}
	  		pp.appendChild(ii);
	}

	for(var i=0; i<rows; i++)
	{
		var tmpAr = [];
		for(var j=0; j<cols; j++)
		{
			var cc = new Cell(i,j);
			tmpAr.push(cc);
		}
		allCells.push(tmpAr);
	}

	for (var i=0; i<rows; i++)
	{
		var tmpAr = [];
		for(var j=0; j<cols; j++)
		{
			tmpAr.push(0);
		}
		allBombs.push(tmpAr);
	}

	//assign random bombs
	for(var i=0; i<bombNum; i++)
	{
		var x = Math.floor(Math.random() * rows);
		var y = Math.floor(Math.random() * cols);
		while(allBombs[x][y]==1)
		{
			x = Math.floor(Math.random() * rows);
			y = Math.floor(Math.random() * cols);
		}
		allBombs[x][y]= 1;
		allCells[x][y].hasBomb=true;
	}

	//set the "bombsAround" field for cell objects:
	for(var i=0; i<rows; i++){

		for(var j=0; j<cols; j++){

			for(var k=-1; k<2; k++)
			{
				var tmpi = i+k;
				for(var v = -1; v<2; v++)
				{
					var tmpj = j+v;

					if( (tmpi >=0 ) && (tmpj >=0 ) && (tmpj < cols )&& (tmpi < rows ) )
					{
						if( (k==0) && (v==0) ){}
							else
							{
								
								allCells[i][j].bombsAround = allCells[i][j].bombsAround + allBombs[tmpi][tmpj];
							}
					}

				}

			}

		}
	}


}

function reveal()
{
	d.innerHTML = processedSoFar;
	if(gameOver) return;


	if(document.getElementById("flaggingCheckbox").checked)
	{
		d.innerHTML = "flaggingMode";
		if(!allCells[this.dataset.row][this.dataset.column].processed)
		{
			if(allCells[this.dataset.row][this.dataset.column].flagged) 
				{
					allCells[this.dataset.row][this.dataset.column].flagged = false;
					this.src="hidden.png";
				}

			else if(!allCells[this.dataset.row][this.dataset.column].flagged) 
				{
					allCells[this.dataset.row][this.dataset.column].flagged = true;
					this.src="flag.png"; 
				}

			else d.innerHTML = "invalid source for img cell has source" + this.src;
		}
		else{
			//cell is already popped
		}
		return;
	}

	//if we are in "revealing mode": no flagging 

	if(allCells[this.dataset.row][this.dataset.column].flagged) return; 
	if(allBombs[this.dataset.row][this.dataset.column])
	{
		
		gameOver=true;
		


		for(var i=0; i<rows; i++)
		{
			for(var j=0; j<cols; j++)
			{
				var targetID= i + "," +j;
				var target=document.getElementById(targetID);
				if(allBombs[i][j]==1)
				{
						
							if( typeof target != undefined )
							{
									if(!allCells[i][j].flagged) target.src="bomb.png";
							
							}
							else
							{//this should never happen
								console.log("ID of :" + targetID + "was not found after gameOver");
							}
				}
				if(allCells[i][j].flagged && !allBombs[i][j])
				{
					target.src="wrongflag.png";

				}
			}
		}
		
		this.src="redbomb.png";

	}

	else if(allCells[this.dataset.row][this.dataset.column].bombsAround ==0)
	{
			this.src=imgSrc[0];
			allCells[this.dataset.row][this.dataset.column].processed=true;
			processedSoFar++;

		for(var i=-1; i<2; i++)
		{
			var tmpi = Number(this.dataset.row) + Number(i);

			for(var j=-1; j<2; j++)
			{
				var tmpj = Number(this.dataset.column) + Number(j); 

				if( (tmpi<0) || (tmpi>=rows) || (tmpj<0) || (tmpj>=cols) )
				{
					//invalid
				}
				else
				{
					if((i==0) && (j==0))
					{
							//already processed this one. 
					}else
					{
						if( (!allCells[tmpi][tmpj].processed) && (!allCells[tmpi][tmpj].hasBomb) &&(!allCells[tmpi][tmpj].flagged) )
						{
						var neighbourID= tmpi + "," +tmpj;
				
						var neighbour=document.getElementById(neighbourID);
							if( typeof neighbour != undefined )
							{
							reveal.call(neighbour);
							}
							else
							{//this should never happen
								console.log("ID of :" + neighbourID + "was not found");
							}
						}

					}
				}


			}
		}
		
	}//end of if cell is 0 bombs around
	else 
	{
	 this.src=imgSrc[allCells[this.dataset.row][this.dataset.column].bombsAround];
	 allCells[this.dataset.row][this.dataset.column].processed = true; 
	 processedSoFar++;
	}

	
	
}