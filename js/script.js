const game_screen=document.querySelector('.game-screen');

for(i=1;i<=200;i++){
    game_screen.innerHTML+='<div class="game-grid"></div>'
};

const grids=Array.from(document.querySelectorAll('.game-grid'))
const width=10;
const l_block=[
    [1,width+1,width*2+1,width*2+2],
    [1,2,3,width+1],
    [1,2,width+2,width*2+2],
    [3,width+1,width+2,width+3]
];
const o_block=[
    [1,2,width+1,width+2],
    [1,2,width+1,width+2],
    [1,2,width+1,width+2],
    [1,2,width+1,width+2]
];
const i_block=[
    [1,width+1,width*2+1,width*3+1],
    [1,2,3,4],
    [1,width+1,width*2+1,width*3+1],
    [1,2,3,4]
];
const t_block=[
    [1,2,3,width+2],
    [2,width+1,width+2,width*2+2],
    [2,width+1,width+2,width+3],
    [1,width+1,width+2,width*2+1]
];
const blocks=[l_block,o_block,i_block,t_block];
let from_left=4;
let from_top=0;
let rotation_no=1;
let block_no=Random_no();
let game_over=false;
let incremented_score=0;
let tot_score=0;
let pause=false;
let active_grids=document.querySelectorAll('.show-grid');
const stop_btn=document.querySelector('#stop-btn');
const start_btn=document.querySelector('#start-btn');
const score=document.querySelector('#score');

function show_block(){
    //first removing all the shown grid
    grids.forEach((each)=>{
        each.classList.remove('show-grid');
        each.style.backgroundColor="";
    })
    //checking for the bottom of game screen
    stop_block()
    //showing the grids
    show_grid();
};

//game main function
function rungame(){
    //show blocks
    show_block(from_left,from_top,block_no,rotation_no);
    //checking for game over
    active_grids=grids.filter(grid=>grid.classList.contains('fixed-grid'));
    if(active_grids.some(grid=>grids.indexOf(grid)<10)){
        score.innerHTML='Score:Game Over'
        return;
    };
    from_top+=1;
    if(!pause){
        setTimeout(()=>{rungame()},500);
    };
};

//showing the blocks
function show_grid(){
    blocks[block_no-1][rotation_no-1].forEach((each)=>{
        var grid_no=((width*from_top)+from_left)+each;
        grids[grid_no].classList.add('show-grid');
    });
}

//stopin the block
function stop_block(){
    //checking for the bottom
    blocks[block_no-1][rotation_no-1].forEach((each)=>{
        var grid_no=((width*from_top)+from_left)+each;
        if(grid_no>=190){
            blocks[block_no-1][rotation_no-1].forEach((each)=>{
                var grid_no=((width*from_top)+from_left)+each;
                grids[grid_no].classList.add('fixed-grid');
            });
            give_score();
            choose_next_block();
        }//checking if it reached another block
        else if(grids[grid_no+width].classList.contains('fixed-grid')){
            blocks[block_no-1][rotation_no-1].forEach((each)=>{
                var grid_no=((width*from_top)+from_left)+each;
                grids[grid_no].classList.add('fixed-grid');
            });
            give_score();
            choose_next_block();
        }  
    });
}

//changing for the next block
function choose_next_block(){
        block_no=Random_no();
        from_top=0;
        from_left=4;
        rotation_no=1;
}

//scoring
function give_score(){
    var score_multipier=0;
    for(i=1;i<=20;i++){
        var temp_grids=grids.slice(((i-1)*10),(10*i));
        var down_from=(i-1)*10;
        if(temp_grids.every(each=>each.classList.contains('fixed-grid'))){
            score_multipier+=1;
            temp_grids.forEach(each=>{
                each.classList.remove('fixed-grid');
            });
            for(var i=down_from;i>0;i--){
                if(grids[i].classList.contains('fixed-grid')){
                    grids[i].classList.remove('fixed-grid');
                    grids[i+width].classList.add('fixed-grid');
                };
            };
        };
    };
    incremented_score=10*score_multipier;
    tot_score+=incremented_score;
    score.innerHTML="Score: "+tot_score;
};

//function to get random no
function Random_no() {
    return Math.floor((Math.random() * 4)+1);
}

//taking inputs
//checking keypress inputs
document.addEventListener('keydown',(event)=>{
    event.preventDefault();
    var key_code=event.keyCode;
    //index of all the fixed grids
    fixed_grids=grids.filter(grid=>grid.classList.contains('fixed-grid')).map(each=>grids.indexOf(each));
    //index of al the acive grids
    active_grids=grids.filter(grid=>grid.classList.contains('show-grid')).map(each=>grids.indexOf(each));
    //left key
    if(key_code===37){  
        from_left-=1;
        if(from_left<-1){
            from_left=-1;
        };
        next_active_grids=active_grids.map(each=>each-1);
        next_active_grids=next_active_grids.concat(active_grids.map(each=>each-1+width));
        if(next_active_grids.some(each=>fixed_grids.includes(each))){
            from_left+=1;
        };
    }
    //up key to rotate
    else if(key_code===38){ 
        rotation_no+=1;
        if(rotation_no>4){
            rotation_no=1
        };
    }
    //right key
    else if(key_code===39){ 
        //index of al the acive grids
        active_grids=grids.filter(grid=>grid.classList.contains('show-grid')).map(each=>grids.indexOf(each));
        if(active_grids.some(grid=>(grid+1)%10===0)){
            //pass
        }else{
            from_left+=1;
            next_active_grids=active_grids.map(each=>each+1);
        }
        next_active_grids=active_grids.map(each=>each-1);
        next_active_grids=next_active_grids.concat(active_grids.map(each=>each+1+width));
        if(next_active_grids.some(each=>fixed_grids.includes(each))){
            from_left-=1;
        };
    };
})

//checking to pause the game
stop_btn.addEventListener('click',()=>{
    if(pause){
        stop_btn.innerHTML="Pause";
        pause=false;
        rungame();
    }
    else{
        stop_btn.innerHTML="Play";
        pause=true;
    };
});

//starting the game
start_btn.addEventListener('click',()=>{
    score.innerHTML="Score: 0";
    start_btn.innerHTML="Restart";
    choose_next_block();
    grids.forEach(each=>each.classList.remove('fixed-grid'));
    rungame();
});