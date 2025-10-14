// script.js - Play Buriti (Todos os 24 jogos integrados)

// ============================
// CONFIGURAÇÕES DE JOGOS
// ============================
<script>
const jogos = [
    "snake","tetris","pong","memoria","flappy","pacman","dino","campoMinado",
    "game2048","corrida","futebol","clicker","space","mario","rpg","tower",
    "pesca","simcity","xadrez","velha","uno","breakout","tiro","puzzle"
];

// ============================
// MODAL DE JOGO
// ============================
function criarModal() {
    if(document.getElementById("gameModal")) return;

    let modal = document.createElement("div");
    modal.id = "gameModal";
    modal.style.cssText = `
        position: fixed; top:0; left:0; width:100%; height:100%;
        background: rgba(0,0,0,0.85); display:flex; flex-direction:column;
        justify-content:center; align-items:center; z-index:9999;
    `;

    let header = document.createElement("div");
    header.id = "gameTitle";
    header.style.cssText = `
        width: 100%; text-align:center; padding:10px;
        background: #1e293b; color: white; font-size: 1.5rem; font-weight:bold;
    `;
    modal.appendChild(header);

    let gameArea = document.createElement("div");
    gameArea.id = "gameArea";
    gameArea.style.cssText = `
        width: 90%; max-width: 800px; height: 500px;
        background: #0f172a; margin:20px auto; border-radius:10px;
        display:flex; justify-content:center; align-items:center; position:relative;
    `;
    modal.appendChild(gameArea);

    let btn = document.createElement("button");
    btn.textContent = "⬅ Voltar ao Menu";
    btn.style.cssText = `
        padding: 10px 20px; background:#2563eb; color:white; border:none;
        border-radius:8px; cursor:pointer; font-weight:bold; margin-bottom:20px;
        transition: all 0.3s; 
    `;
    btn.onmouseover = () => btn.style.background="#7c3aed";
    btn.onmouseout = () => btn.style.background="#2563eb";
    btn.onclick = () => document.body.removeChild(modal);
    modal.appendChild(btn);

    document.body.appendChild(modal);
}

// ============================
// ABRIR JOGO SELECIONADO
// ============================
function abrirJogo(nome) {
    criarModal();
    document.getElementById("gameTitle").textContent = nome;
    const gameArea = document.getElementById("gameArea");
    gameArea.innerHTML = "";

    const funcName = "jogo" + nome.charAt(0).toUpperCase() + nome.slice(1);
    if(typeof window[funcName] === "function") {
        window[funcName](gameArea);
    } else {
        gameArea.innerHTML = `<p style="color:white;">O jogo "${nome}" ainda não está implementado.</p>`;
    }
}

// ============================
// JOGO SNAKE
// ============================
function jogoSnake(container){
    container.innerHTML = "";
    let canvas = document.createElement("canvas");
    canvas.width = 600; canvas.height = 400;
    canvas.style.background = "#0f172a"; container.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let grid = 20, count = 0;
    let snake = {x:160, y:160, dx:grid, dy:0, cells:[], maxCells:4};
    let apple = {x:320, y:320};
    let score = 0;

    function getRandomInt(min,max){ return Math.floor(Math.random()*(max-min)) + min; }

    function loop(){
        requestAnimationFrame(loop);
        if(++count<4) return; count=0;
        ctx.clearRect(0,0,canvas.width,canvas.height);

        snake.x += snake.dx; snake.y += snake.dy;
        if(snake.x<0) snake.x=canvas.width-grid;
        if(snake.x>=canvas.width) snake.x=0;
        if(snake.y<0) snake.y=canvas.height-grid;
        if(snake.y>=canvas.height) snake.y=0;

        snake.cells.unshift({x:snake.x, y:snake.y});
        if(snake.cells.length>snake.maxCells) snake.cells.pop();

        ctx.fillStyle = "red";
        ctx.fillRect(apple.x,apple.y,grid-1,grid-1);

        ctx.fillStyle = "lime";
        snake.cells.forEach((cell,index)=>{
            ctx.fillRect(cell.x,cell.y,grid-1,grid-1);
            if(cell.x===apple.x && cell.y===apple.y){
                snake.maxCells++; score++;
                apple.x = getRandomInt(0,canvas.width/grid)*grid;
                apple.y = getRandomInt(0,canvas.height/grid)*grid;
            }
            for(let i=index+1;i<snake.cells.length;i++){
                if(cell.x===snake.cells[i].x && cell.y===snake.cells[i].y){
                    snake.x=160; snake.y=160; snake.cells=[]; snake.maxCells=4; snake.dx=grid; snake.dy=0; score=0;
                }
            }
        });

        ctx.fillStyle="white"; ctx.font="20px Arial";
        ctx.fillText("Score: "+score,10,20);
    }

    document.addEventListener("keydown", e=>{
        if(e.key==="ArrowLeft" && snake.dx===0){snake.dx=-grid;snake.dy=0;}
        if(e.key==="ArrowUp" && snake.dy===0){snake.dx=0;snake.dy=-grid;}
        if(e.key==="ArrowRight" && snake.dx===0){snake.dx=grid;snake.dy=0;}
        if(e.key==="ArrowDown" && snake.dy===0){snake.dx=0;snake.dy=grid;}
    });

    loop();
}

// ============================
// JOGO TETRIS
// ============================
function jogoTetris(container){
    container.innerHTML="";
    let canvas=document.createElement("canvas"); canvas.width=300; canvas.height=600;
    canvas.style.background="#0f172a"; container.appendChild(canvas);
    const ctx=canvas.getContext("2d");

    const ROWS=20,COLS=10,SIZE=30;
    let board=Array.from({length:ROWS},()=>Array(COLS).fill(0));
    let pieces=[
        [[1,1,1],[0,1,0]], [[1,1],[1,1]], [[0,1,1],[1,1,0]],
        [[1,1,0],[0,1,1]], [[1,1,1,1]], [[1,0,0],[1,1,1]], [[0,0,1],[1,1,1]]
    ];
    let colors=["#f00","#0f0","#00f","#ff0","#0ff","#f0f","#fff"];
    let current={x:3,y:0,shape:pieces[Math.floor(Math.random()*pieces.length)],color:colors[Math.floor(Math.random()*colors.length)]};

    function drawBlock(x,y,c){ctx.fillStyle=c;ctx.fillRect(x*SIZE,y*SIZE,SIZE,SIZE); ctx.strokeStyle="#111"; ctx.strokeRect(x*SIZE,y*SIZE,SIZE,SIZE);}
    function drawBoard(){
        ctx.fillStyle="#0f172a"; ctx.fillRect(0,0,canvas.width,canvas.height);
        for(let r=0;r<ROWS;r++){
            for(let c=0;c<COLS;c++){ if(board[r][c]) drawBlock(c,r,board[r][c]); }
        }
        current.shape.forEach((row,dy)=>{
            row.forEach((val,dx)=>{ if(val) drawBlock(current.x+dx,current.y+dy,current.color); });
        });
    }

    function collide(){
        for(let y=0;y<current.shape.length;y++){
            for(let x=0;x<current.shape[y].length;x++){
                if(current.shape[y][x] && ((board[current.y+y] && board[current.y+y][current.x+x])!==0 || current.y+y>=ROWS)) return true;
            }
        }
        return false;
    }

    function merge(){ current.shape.forEach((row,dy)=>{ row.forEach((val,dx)=>{ if(val) board[current.y+dy][current.x+dx]=current.color; }); }); }

    function rotate(){ 
        let n=current.shape.length; 
        let newShape=Array.from({length:n},()=>Array(n).fill(0));
        for(let y=0;y<n;y++) for(let x=0;x<n;x++) newShape[x][n-1-y]=current.shape[y][x];
        current.shape=newShape; if(collide()){ current.shape=newShape; } 
    }

    function clearLines(){
        for(let y=ROWS-1;y>=0;y--){
            if(board[y].every(val=>val!==0)){ board.splice(y,1); board.unshift(Array(COLS).fill(0)); }
        }
    }

    let dropCounter=0,dropInterval=30;
    function loop(){
        dropCounter++;
        if(dropCounter>=dropInterval){
            dropCounter=0; current.y++;
            if(collide()){ current.y--; merge(); current={x:3,y:0,shape:pieces[Math.floor(Math.random()*pieces.length)],color:colors[Math.floor(Math.random()*colors.length)]}; }
            clearLines();
        }
        drawBoard();
        requestAnimationFrame(loop);
    }

    document.addEventListener("keydown",e=>{
        if(e.key==="ArrowLeft"){ current.x--; if(collide()) current.x++; }
        if(e.key==="ArrowRight"){ current.x++; if(collide()) current.x--; }
        if(e.key==="ArrowDown"){ current.y++; if(collide()){ current.y--; merge(); current={x:3,y:0,shape:pieces[Math.floor(Math.random()*pieces.length)],color:colors[Math.floor(Math.random()*colors.length)]}; } }
        if(e.key==="ArrowUp"){ rotate(); }
    });
    loop();
}

// ============================
// JOGO PONG (IA)
// ============================
function jogoPong(container){
    container.innerHTML="";
    let canvas=document.createElement("canvas"); canvas.width=600; canvas.height=400;
    canvas.style.background="#0f172a"; container.appendChild(canvas);
    const ctx=canvas.getContext("2d");

    let paddleWidth=10, paddleHeight=80, ballSize=12;
    let player={x:10,y:160,dy:0};
    let ai={x:580,y:160,dy:0};
    let ball={x:300,y:200,dx:4,dy:4};
    let score={player:0,ai:0};

    function loop(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        // Paddles
        ctx.fillStyle="lime"; ctx.fillRect(player.x,player.y,paddleWidth,paddleHeight);
        ctx.fillStyle="red"; ctx.fillRect(ai.x,ai.y,paddleWidth,paddleHeight);
        // Ball
        ctx.fillStyle="white"; ctx.fillRect(ball.x,ball.y,ballSize,ballSize);
        ball.x+=ball.dx; ball.y+=ball.dy;

        if(ball.y<=0 || ball.y+ballSize>=canvas.height) ball.dy*=-1;
        if(ball.x<=player.x+paddleWidth && ball.y+ballSize>=player.y && ball.y<=player.y+paddleHeight) ball.dx*=-1;
        if(ball.x+ballSize>=ai.x && ball.y+ballSize>=ai.y && ball.y<=ai.y+paddleHeight) ball.dx*=-1;

        if(ball.x<0){ score.ai++; resetBall(); }
        if(ball.x>canvas.width){ score.player++; resetBall(); }

        // IA simples
        let targetY=ball.y - paddleHeight/2; ai.y+= (targetY - ai.y)*0.05;

        ctx.fillStyle="white"; ctx.font="20px Arial";
        ctx.fillText("Player: "+score.player,10,20);
        ctx.fillText("AI: "+score.ai,500,20);

        requestAnimationFrame(loop);
    }

    function resetBall(){ ball.x=300; ball.y=200; ball.dx=4*(Math.random()>0.5?1:-1); ball.dy=4*(Math.random()>0.5?1:-1); }

    document.addEventListener("keydown",e=>{
        if(e.key==="ArrowUp") player.y-=10;
        if(e.key==="ArrowDown") player.y+=10;
    });
    loop();
}
// ============================
// JOGO MEMÓRIA DE FRUTAS
// ============================
function jogoMemoria(container){
    container.innerHTML="";
    let frutas=["🍎","🍌","🍇","🍉","🍓","🥝","🍍","🍑"];
    let cartas=[...frutas,...frutas].sort(()=>Math.random()-0.5);
    let primeira=null, segunda=null, bloqueio=false, acertos=0;

    let grid=document.createElement("div");
    grid.style.cssText="display:grid;grid-template-columns:repeat(4,80px);gap:10px;justify-content:center;align-items:center;";
    cartas.forEach((fruta,i)=>{
        let c=document.createElement("div");
        c.textContent="❔";
        c.style.cssText="font-size:40px;width:80px;height:80px;display:flex;align-items:center;justify-content:center;background:#1e293b;border-radius:10px;cursor:pointer;";
        c.onclick=function(){
            if(bloqueio || c.textContent!== "❔") return;
            c.textContent=fruta;
            if(!primeira) primeira=c;
            else{
                segunda=c; bloqueio=true;
                setTimeout(()=>{
                    if(primeira.textContent!==segunda.textContent){
                        primeira.textContent="❔";
                        segunda.textContent="❔";
                    }else acertos++;
                    primeira=null; segunda=null; bloqueio=false;
                    if(acertos===frutas.length) alert("🎉 Você venceu!");
                },800);
            }
        };
        grid.appendChild(c);
    });
    container.appendChild(grid);
}

// ============================
// JOGO FLAPPY BIRD
// ============================
function jogoFlappy(container){
    container.innerHTML="";
    let canvas=document.createElement("canvas"); canvas.width=400; canvas.height=500;
    canvas.style.background="#0f172a"; container.appendChild(canvas);
    const ctx=canvas.getContext("2d");

    let bird={x:80,y:250,vy:0};
    let pipes=[];
    let score=0;
    let gravity=0.6, jump=-10;
    let interval=setInterval(loop,20);

    function loop(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        bird.vy+=gravity; bird.y+=bird.vy;
        if(bird.y>canvas.height) { alert("💥 Game Over! Score: "+score); clearInterval(interval); return; }

        if(Math.random()<0.02) pipes.push({x:canvas.width, y:Math.random()*300+50});
        for(let i=pipes.length-1;i>=0;i--){
            pipes[i].x-=2;
            ctx.fillStyle="green"; ctx.fillRect(pipes[i].x,0,50,pipes[i].y-100);
            ctx.fillRect(pipes[i].x,pipes[i].y,50,canvas.height);
            if(pipes[i].x+50<0) pipes.splice(i,1);
            if(bird.x+20>pipes[i].x && bird.x< pipes[i].x+50 && (bird.y< pipes[i].y-100 || bird.y+20>pipes[i].y)){
                alert("💥 Game Over! Score: "+score); clearInterval(interval); return;
            }
            if(!pipes[i].passed && pipes[i].x+50<bird.x){score++; pipes[i].passed=true;}
        }

        ctx.fillStyle="yellow"; ctx.fillRect(bird.x,bird.y,20,20);
        ctx.fillStyle="white"; ctx.font="20px Arial"; ctx.fillText("Score: "+score,10,30);
    }

    document.addEventListener("keydown",e=>{ if(e.key===" ") bird.vy=jump; });
}

// ============================
// JOGO PAC-MAN
// ============================
function jogoPacman(container){
    container.innerHTML="";
    let canvas=document.createElement("canvas"); canvas.width=400; canvas.height=400;
    canvas.style.background="#0f172a"; container.appendChild(canvas);
    const ctx=canvas.getContext("2d");

    const grid=20, rows=20, cols=20;
    let pac={x:10, y:10, dx:0, dy:0};
    let pontos=[];
    for(let i=0;i<cols;i++) for(let j=0;j<rows;j++) pontos.push({x:i,y:j,col:true});
    let score=0;

    function loop(){
        ctx.fillStyle="#0f172a"; ctx.fillRect(0,0,canvas.width,canvas.height);
        pac.x+=pac.dx; pac.y+=pac.dy;
        if(pac.x<0) pac.x=cols-1; if(pac.x>=cols) pac.x=0;
        if(pac.y<0) pac.y=rows-1; if(pac.y>=rows) pac.y=0;

        pontos.forEach(p=>{
            if(p.col){ ctx.fillStyle="white"; ctx.beginPath(); ctx.arc(p.x*grid+grid/2,p.y*grid+grid/2,5,0,2*Math.PI); ctx.fill(); }
            if(p.x===pac.x && p.y===pac.y && p.col){p.col=false; score++; }
        });

        ctx.fillStyle="yellow"; ctx.fillRect(pac.x*grid,pac.y*grid,grid,grid);
        ctx.fillStyle="white"; ctx.font="20px Arial"; ctx.fillText("Score: "+score,10,20);
        requestAnimationFrame(loop);
    }
    loop();

    document.addEventListener("keydown",e=>{
        if(e.key==="ArrowLeft") {pac.dx=-1;pac.dy=0;}
        if(e.key==="ArrowRight") {pac.dx=1;pac.dy=0;}
        if(e.key==="ArrowUp") {pac.dx=0;pac.dy=-1;}
        if(e.key==="ArrowDown") {pac.dx=0;pac.dy=1;}
    });
}

// ============================
// JOGO DINO RUN
// ============================
function jogoDino(container){
    container.innerHTML="";
    let canvas=document.createElement("canvas"); canvas.width=600; canvas.height=200;
    canvas.style.background="#0f172a"; container.appendChild(canvas);
    const ctx=canvas.getContext("2d");

    let dino={x:50,y:150,vy:0,jump:false};
    let obstacles=[];
    let score=0;
    let gravity=0.6;

    function loop(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        dino.vy+=gravity; dino.y+=dino.vy;
        if(dino.y>150){ dino.y=150; dino.vy=0; dino.jump=false; }
        ctx.fillStyle="lime"; ctx.fillRect(dino.x,dino.y,20,20);

        if(Math.random()<0.02) obstacles.push({x:canvas.width,y:150});
        obstacles.forEach((o,i)=>{
            o.x-=5; ctx.fillStyle="red"; ctx.fillRect(o.x,o.y,20,20);
            if(o.x<0) obstacles.splice(i,1);
            if(dino.x<o.x+20 && dino.x+20>o.x && dino.y<o.y+20 && dino.y+20>o.y){
                alert("💥 Game Over! Score: "+score); obstacles=[]; score=0;
            }
        });
        score++;
        ctx.fillStyle="white"; ctx.font="20px Arial"; ctx.fillText("Score: "+score,10,20);
        requestAnimationFrame(loop);
    }

    document.addEventListener("keydown",e=>{ if(e.key===" " && !dino.jump){ dino.vy=-12; dino.jump=true; } });
    loop();
}

// ============================
// JOGO CAMPO MINADO
// ============================
function jogoCampoMinado(container){
    container.innerHTML="";
    const rows=8,cols=8,mines=10;
    let grid=[];
    let revealed=Array.from({length:rows},()=>Array(cols).fill(false));

    let table=document.createElement("table");
    table.style.cssText="border-collapse:collapse;margin:auto;";
    container.appendChild(table);

    function gerarGrid(){
        grid=Array.from({length:rows},()=>Array(cols).fill(0));
        let placed=0;
        while(placed<mines){
            let r=Math.floor(Math.random()*rows),c=Math.floor(Math.random()*cols);
            if(grid[r][c]===0){ grid[r][c]=-1; placed++; }
        }
        for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){
            if(grid[r][c]!==-1){
                let count=0;
                for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){
                    let nr=r+dr,nc=c+dc;
                    if(nr>=0 && nr<rows && nc>=0 && nc<cols && grid[nr][nc]===-1) count++;
                }
                grid[r][c]=count;
            }
        }
    }

    function render(){
        table.innerHTML="";
        for(let r=0;r<rows;r++){
            let tr=document.createElement("tr");
            for(let c=0;c<cols;c++){
                let td=document.createElement("td");
                td.style.cssText="width:40px;height:40px;border:1px solid #fff;text-align:center;font-weight:bold;font-size:20px;color:white;cursor:pointer;background:#1e293b;";
                td.textContent=revealed[r][c]? (grid[r][c]===-1?"💣":grid[r][c]||"") : "";
                td.onclick=function(){
                    revealed[r][c]=true; if(grid[r][c]===-1) alert("💥 Boom!"); render();
                };
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
    }

    gerarGrid(); render();
}
// ============================
// JOGO 2048
// ============================
function jogo2048(container){
    container.innerHTML="";
    let grid=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    let score=0;

    function addTile(){
        let empty=[];
        for(let r=0;r<4;r++) for(let c=0;c<4;c++) if(grid[r][c]===0) empty.push([r,c]);
        if(empty.length===0) return;
        let [r,c]=empty[Math.floor(Math.random()*empty.length)];
        grid[r][c]=Math.random()<0.9?2:4;
    }

    function draw(){
        container.innerHTML="";
        let table=document.createElement("div");
        table.style.cssText="display:grid;grid-template-columns:repeat(4,80px);gap:5px;justify-content:center;margin:auto;";
        for(let r=0;r<4;r++) for(let c=0;c<4;c++){
            let cell=document.createElement("div");
            cell.textContent=grid[r][c]||"";
            cell.style.cssText=`width:80px;height:80px;background:#1e293b;color:white;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:bold;border-radius:8px;`;
            table.appendChild(cell);
        }
        container.appendChild(table);
        let scoreDiv=document.createElement("div");
        scoreDiv.textContent="Score: "+score;
        scoreDiv.style.cssText="text-align:center;margin-top:10px;font-size:20px;";
        container.appendChild(scoreDiv);
    }

    function move(dir){
        let moved=false;
        function slide(row){
            let arr=row.filter(v=>v); 
            for(let i=0;i<arr.length-1;i++){
                if(arr[i]===arr[i+1]){ arr[i]*=2; score+=arr[i]; arr[i+1]=0; i++; }
            }
            arr=arr.filter(v=>v);
            while(arr.length<4) arr.push(0);
            return arr;
        }

        if(dir==="left") for(let r=0;r<4;r++){ let tmp=slide(grid[r]); if(tmp.toString()!==grid[r].toString()){grid[r]=tmp;moved=true;} }
        if(dir==="right") for(let r=0;r<4;r++){ let tmp=slide(grid[r].reverse()).reverse(); if(tmp.toString()!==grid[r].toString()){grid[r]=tmp;moved=true;} }
        if(dir==="up") for(let c=0;c<4;c++){ let col=slide(grid.map(r=>r[c])); for(let r=0;r<4;r++){ if(grid[r][c]!==col[r]) moved=true; grid[r][c]=col[r]; } }
        if(dir==="down") for(let c=0;c<4;c++){ let col=slide(grid.map(r=>r[c]).reverse()).reverse(); for(let r=0;r<4;r++){ if(grid[r][c]!==col[r]) moved=true; grid[r][c]=col[r]; } }

        if(moved) addTile(); draw();
    }

    addTile(); addTile(); draw();
    document.addEventListener("keydown",e=>{
        if(e.key==="ArrowLeft") move("left");
        if(e.key==="ArrowRight") move("right");
        if(e.key==="ArrowUp") move("up");
        if(e.key==="ArrowDown") move("down");
    });
}

// ============================
// JOGO CORRIDA DE CARROS
// ============================
function jogoCorrida(container){
    container.innerHTML="";
    let canvas=document.createElement("canvas"); canvas.width=400; canvas.height=500;
    container.appendChild(canvas);
    const ctx=canvas.getContext("2d");

    let player={x:180,y:400,width:40,height:60};
    let obstacles=[];
    let score=0;

    function loop(){
        ctx.fillStyle="#0f172a"; ctx.fillRect(0,0,canvas.width,canvas.height);
        player.x=Math.max(0, Math.min(canvas.width-player.width, player.x));
        ctx.fillStyle="lime"; ctx.fillRect(player.x,player.y,player.width,player.height);

        if(Math.random()<0.03) obstacles.push({x:Math.random()*360,y:-60,width:40,height:60});
        obstacles.forEach((o,i)=>{
            o.y+=5; ctx.fillStyle="red"; ctx.fillRect(o.x,o.y,o.width,o.height);
            if(o.y>canvas.height) obstacles.splice(i,1), score++;
            if(o.x<player.x+player.width && o.x+o.width>player.x && o.y<player.y+player.height && o.y+o.height>player.y){
                alert("💥 Game Over! Score: "+score); obstacles=[]; score=0;
            }
        });
        ctx.fillStyle="white"; ctx.font="20px Arial"; ctx.fillText("Score: "+score,10,30);
        requestAnimationFrame(loop);
    }

    document.addEventListener("keydown",e=>{
        if(e.key==="ArrowLeft") player.x-=10;
        if(e.key==="ArrowRight") player.x+=10;
    });

    loop();
}

// ============================
// JOGO BURITI CUP (FUTEBOL)
// ============================
function jogoBuritiCup(container){
    container.innerHTML="";
    let canvas=document.createElement("canvas"); canvas.width=400; canvas.height=300;
    container.appendChild(canvas);
    const ctx=canvas.getContext("2d");

    let ball={x:200,y:150,dx:3,dy:3,r:10};
    let player={x:180,y:250,width:40,height:10};
    let ai={x:180,y:40,width:40,height:10};
    let scoreP=0, scoreAI=0;

    function loop(){
        ctx.fillStyle="#0f172a"; ctx.fillRect(0,0,canvas.width,canvas.height);

        // Bola
        ball.x+=ball.dx; ball.y+=ball.dy;
        if(ball.x<0 || ball.x>canvas.width) ball.dx*=-1;
        if(ball.y<0){ scoreP++; resetBall(); }
        if(ball.y>canvas.height){ scoreAI++; resetBall(); }
        if(ball.x>player.x && ball.x<player.x+player.width && ball.y+ball.r>player.y) ball.dy*=-1;
        if(ball.x>ai.x && ball.x<ai.x+ai.width && ball.y-ball.r<ai.y+ai.height) ball.dy*=-1;

        ctx.fillStyle="white"; ctx.beginPath(); ctx.arc(ball.x,ball.y,ball.r,0,2*Math.PI); ctx.fill();
        ctx.fillStyle="blue"; ctx.fillRect(player.x,player.y,player.width,player.height);
        ctx.fillStyle="red"; ctx.fillRect(ai.x,ai.y,ai.width,ai.height);

        ctx.fillStyle="white"; ctx.font="20px Arial"; ctx.fillText(`P:${scoreP} AI:${scoreAI}`,10,20);

        // IA simples
        if(ai.x+ai.width/2<ball.x) ai.x+=3;
        else ai.x-=3;

        requestAnimationFrame(loop);
    }

    function resetBall(){ ball.x=200; ball.y=150; ball.dx=3; ball.dy=3; }

    document.addEventListener("keydown",e=>{
        if(e.key==="ArrowLeft") player.x-=10;
        if(e.key==="ArrowRight") player.x+=10;
    });

    loop();
}

// ============================
// JOGO CLICKER
// ============================
function jogoClicker(container){
    container.innerHTML="";
    let count=0;
    let btn=document.createElement("button");
    btn.textContent="Clique Aqui!";
    btn.style.cssText="padding:20px 40px;font-size:24px;background:#2563eb;color:white;border:none;border-radius:12px;cursor:pointer;";
    btn.onclick=function(){ count++; scoreDisplay.textContent="Score: "+count; };
    let scoreDisplay=document.createElement("div");
    scoreDisplay.textContent="Score: 0";
    scoreDisplay.style.cssText="margin-top:20px;font-size:24px;text-align:center;";
    container.appendChild(btn); container.appendChild(scoreDisplay);
}

// ============================
// JOGO SPACE INVADERS
// ============================
function jogoSpaceInvaders(container){
    container.innerHTML="";
    let canvas=document.createElement("canvas"); canvas.width=400; canvas.height=500;
    container.appendChild(canvas);
    const ctx=canvas.getContext("2d");

    let player={x:180,y:450,width:40,height:20};
    let bullets=[];
    let enemies=[];
    let score=0;

    for(let i=0;i<5;i++) for(let j=0;j<3;j++) enemies.push({x:50+i*70,y:50+j*40,width:40,height:20});

    function loop(){
        ctx.fillStyle="#0f172a"; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle="lime"; ctx.fillRect(player.x,player.y,player.width,player.height);

        bullets.forEach((b,i)=>{
            b.y-=5; ctx.fillRect(b.x,b.y,5,10);
            enemies.forEach((e,j)=>{
                if(b.x<e.x+e.width && b.x>e.x && b.y<e.y+e.height && b.y>e.y){ enemies.splice(j,1); bullets.splice(i,1); score+=10; }
            });
        });

        enemies.forEach(e=>{
            ctx.fillStyle="red"; ctx.fillRect(e.x,e.y,e.width,e.height);
            e.y+=0.1;
            if(e.y>canvas.height) alert("💥 Game Over! Score: "+score);
        });

        ctx.fillStyle="white"; ctx.font="20px Arial"; ctx.fillText("Score: "+score,10,30);
        requestAnimationFrame(loop);
    }

    document.addEventListener("keydown",e=>{
        if(e.key==="ArrowLeft") player.x-=10;
        if(e.key==="ArrowRight") player.x+=10;
        if(e.key===" ") bullets.push({x:player.x+player.width/2,y:player.y});
    });

    loop();
}
// ============================
// JOGO PLATAFORMA ESTILO MARIO
// ============================
function jogoMario(container){
    container.innerHTML="";
    let canvas=document.createElement("canvas"); canvas.width=600; canvas.height=300;
    container.appendChild(canvas);
    const ctx=canvas.getContext("2d");

    let player={x:50,y:250,vy:0,jump:false};
    let gravity=0.8;
    let platforms=[{x:0,y:280,width:600,height:20},{x:150,y:220,width:100,height:10},{x:300,y:180,width:100,height:10},{x:450,y:140,width:100,height:10}];
    let keys={};

    function loop(){
        ctx.fillStyle="#0f172a"; ctx.fillRect(0,0,canvas.width,canvas.height);
        player.vy+=gravity; player.y+=player.vy;

        // Colisão com chão e plataformas
        platforms.forEach(p=>{
            if(player.x+20>p.x && player.x< p.x+p.width && player.y+20>p.y && player.y+20< p.y+20){
                player.y=p.y-20; player.vy=0; player.jump=false;
            }
        });

        if(keys.ArrowLeft) player.x-=5;
        if(keys.ArrowRight) player.x+=5;
        ctx.fillStyle="red"; ctx.fillRect(player.x,player.y,20,20);
        ctx.fillStyle="brown";
        platforms.forEach(p=>ctx.fillRect(p.x,p.y,p.width,p.height));
        requestAnimationFrame(loop);
    }

    document.addEventListener("keydown",e=>keys[e.key]=true);
    document.addEventListener("keyup",e=>keys[e.key]=false);
    document.addEventListener("keydown",e=>{ if(e.key===" " && !player.jump){ player.vy=-15; player.jump=true; } });
    loop();
}

// ============================
// JOGO AVENTURA RPG SIMPLES
// ============================
function jogoRPG(container){
    container.innerHTML="";
    let canvas=document.createElement("canvas"); canvas.width=400; canvas.height=400;
    container.appendChild(canvas);
    const ctx=canvas.getContext("2d");

    let player={x:200,y:200,hp:100};
    let monster={x:100,y:100,hp:50};

    function loop(){
        ctx.fillStyle="#0f172a"; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle="green"; ctx.fillRect(player.x,player.y,20,20);
        ctx.fillStyle="red"; ctx.fillRect(monster.x,monster.y,20,20);

        ctx.fillStyle="white"; ctx.fillText(`Player HP: ${player.hp}`,10,20);
        ctx.fillText(`Monster HP: ${monster.hp}`,10,40);

        requestAnimationFrame(loop);
    }

    document.addEventListener("keydown",e=>{
        if(e.key==="ArrowLeft") player.x-=5;
        if(e.key==="ArrowRight") player.x+=5;
        if(e.key==="ArrowUp") player.y-=5;
        if(e.key==="ArrowDown") player.y+=5;
        if(e.key===" ") if(Math.abs(player.x-monster.x)<30 && Math.abs(player.y-monster.y)<30) monster.hp-=10;
    });

    loop();
}

// ============================
// JOGO TOWER DEFENSE SIMPLES
// ============================
function jogoTowerDefense(container){
    container.innerHTML="";
    let canvas=document.createElement("canvas"); canvas.width=400; canvas.height=400;
    container.appendChild(canvas);
    const ctx=canvas.getContext("2d");

    let towers=[{x:50,y:50}], enemies=[{x:0,y:200,hp:30}];
    let bullets=[];

    function loop(){
        ctx.fillStyle="#0f172a"; ctx.fillRect(0,0,canvas.width,canvas.height);
        towers.forEach(t=>{
            ctx.fillStyle="blue"; ctx.fillRect(t.x,t.y,20,20);
        });
        enemies.forEach((e,i)=>{
            ctx.fillStyle="red"; ctx.fillRect(e.x,e.y,20,20);
            e.x+=1;
            if(e.x>canvas.width) enemies.splice(i,1);
        });
        bullets.forEach((b,i)=>{
            b.x+=5;
            ctx.fillStyle="yellow"; ctx.fillRect(b.x,b.y,5,5);
            enemies.forEach((e,j)=>{ if(Math.abs(b.x-e.x)<10 && Math.abs(b.y-e.y)<10){ e.hp-=10; bullets.splice(i,1); if(e.hp<=0) enemies.splice(j,1); } });
        });

        // Tiro automático simples
        towers.forEach(towers=>{
            enemies.forEach(e=>{
                if(Math.abs(towers.x-e.x)<100) bullets.push({x:towers.x+10,y:towers.y+10});
            });
        });

        requestAnimationFrame(loop);
    }
    loop();
}

// ============================
// JOGO DE PESCA SIMPLES
// ============================
function jogoPesca(container){
    container.innerHTML="";
    let canvas=document.createElement("canvas"); canvas.width=400; canvas.height=400;
    container.appendChild(canvas);
    const ctx=canvas.getContext("2d");

    let hook={x:200,y:0,catching:false};
    let fish={x:Math.random()*380,y:350,width:20,height:10};
    let score=0;

    function loop(){
        ctx.fillStyle="#0f172a"; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle="white"; ctx.fillRect(hook.x,hook.y,5,20);
        ctx.fillStyle="orange"; ctx.fillRect(fish.x,fish.y,fish.width,fish.height);

        if(hook.y<fish.y+fish.height && hook.y>fish.y && hook.x>fish.x && hook.x<fish.x+fish.width){ score++; fish.x=Math.random()*380; fish.y=350; }

        if(hook.catching) hook.y+=5; else hook.y-=5;
        if(hook.y>canvas.height) hook.y=0;

        ctx.fillStyle="white"; ctx.fillText("Score: "+score,10,20);
        requestAnimationFrame(loop);
    }

    document.addEventListener("keydown",e=>{ if(e.key===" ") hook.catching=!hook.catching; });
    loop();
}

// ============================
// JOGO SIMCITY MINI
// ============================
function jogoSimCity(container){
    container.innerHTML="";
    let grid=[];
    for(let r=0;r<10;r++){ grid[r]=[]; for(let c=0;c<10;c++) grid[r][c]=0; }
    let score=0;

    function draw(){
        container.innerHTML="";
        let table=document.createElement("div");
        table.style.cssText="display:grid;grid-template-columns:repeat(10,30px);gap:2px;margin:auto;";
        for(let r=0;r<10;r++) for(let c=0;c<10;c++){
            let cell=document.createElement("div");
            cell.style.cssText=`width:30px;height:30px;background:${grid[r][c]? "green":"#1e293b"};border-radius:4px;cursor:pointer;`;
            cell.onclick=function(){ grid[r][c]=1; score++; draw(); };
            table.appendChild(cell);
        }
        container.appendChild(table);
        let scoreDiv=document.createElement("div");
        scoreDiv.textContent="Pontuação: "+score; scoreDiv.style.cssText="text-align:center;margin-top:10px;color:white;";
        container.appendChild(scoreDiv);
    }
    draw();
}

// ============================
// JOGO XADREZ SIMPLES
// ============================
function jogoXadrez(container){
    container.innerHTML="";
    let board=[];
    for(let r=0;r<8;r++){ board[r]=[]; for(let c=0;c<8;c++) board[r][c]=null; }
    let table=document.createElement("div");
    table.style.cssText="display:grid;grid-template-columns:repeat(8,50px);gap:0;margin:auto;";
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){
        let cell=document.createElement("div");
        cell.style.cssText=`width:50px;height:50px;background:${(r+c)%2===0? "#fff":"#000"};`;
        table.appendChild(cell);
    }
    container.appendChild(table);
}

// ============================
// JOGO DA VELHA ONLINE
// ============================
function jogoVelha(container){
    container.innerHTML="";
    let board=Array(9).fill(null);
    let turno="X";

    function draw(){
        container.innerHTML="";
        let table=document.createElement("div");
        table.style.cssText="display:grid;grid-template-columns:repeat(3,100px);gap:5px;margin:auto;";
        board.forEach((c,i)=>{
            let cell=document.createElement("div");
            cell.textContent=c||""; cell.style.cssText="width:100px;height:100px;background:#1e293b;color:white;font-size:48px;display:flex;align-items:center;justify-content:center;cursor:pointer;";
            cell.onclick=function(){ if(!board[i]){ board[i]=turno; turno=turno==="X"?"O":"X"; draw(); checkWin(); } };
            table.appendChild(cell);
        });
        container.appendChild(table);
    }

    function checkWin(){
        const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        wins.forEach(w=>{ if(board[w[0]] && board[w[0]]===board[w[1]] && board[w[1]]===board[w[2]]) alert("🎉 Vencedor: "+board[w[0]]); });
    }

    draw();
}

// ============================
// JOGO CARTAS UNO SIMPLES
// ============================
function jogoUNO(container){
    container.innerHTML="";
    let colors=["red","blue","green","yellow"];
    let deck=[];
    for(let i=0;i<4;i++) for(let j=0;j<10;j++) deck.push({color:colors[i],num:j});
    deck.sort(()=>Math.random()-0.5);

    let playerHand=deck.splice(0,7);
    let topCard=deck.pop();

    let handDiv=document.createElement("div"); handDiv.style.cssText="display:flex;justify-content:center;gap:5px;margin-top:20px;";
    playerHand.forEach(card=>{
        let c=document.createElement("div"); c.textContent=card.num; c.style.cssText=`width:50px;height:70px;background:${card.color};display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;cursor:pointer;`;
        c.onclick=function(){ if(card.color===topCard.color || card.num===topCard.num){ topCard=card; c.remove(); } };
        handDiv.appendChild(c);
    });
    container.appendChild(handDiv);
}

// ============================
// JOGO BREAKOUT
// ============================
function jogoBreakout(container){
    container.innerHTML="";
    let canvas=document.createElement("canvas"); canvas.width=400; canvas.height=500;
    container.appendChild(canvas);
    const ctx=canvas.getContext("2d");

    let ball={x:200,y:400,dx:3,dy:-3,r:10};
    let paddle={x:160,y:480,width:80,height:10};
    let bricks=[];
    for(let r=0;r<3;r++) for(let c=0;c<5;c++) bricks.push({x:60*c+20,y:30*r+30,width:50,height:20,alive:true});

    function loop(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle="white"; ctx.beginPath(); ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2); ctx.fill();
        ctx.fillStyle="blue"; ctx.fillRect(paddle.x,paddle.y,paddle.width,paddle.height);
        bricks.forEach(b=>{ if(b.alive){ ctx.fillStyle="red"; ctx.fillRect(b.x,b.y,b.width,b.height); if(ball.x>b.x && ball.x<b.x+b.width && ball.y>b.y && ball.y<b.y+b.height){ ball.dy*=-1; b.alive=false; } } });

        ball.x+=ball.dx; ball.y+=ball.dy;
        if(ball.x<0||ball.x>canvas.width) ball.dx*=-1;
        if(ball.y<0) ball.dy*=-1;
        if(ball.y>canvas.height) { alert("💥 Game Over!"); ball.x=200; ball.y=400; ball.dx=3; ball.dy=-3; }

        requestAnimationFrame(loop);
    }

    document.addEventListener("keydown",e=>{ if(e.key==="ArrowLeft") paddle.x-=10; if(e.key==="ArrowRight") paddle.x+=10; });
    loop();
}

// ============================
// JOGO TIRO RETRO
// ============================
function jogoTiroRetro(container){
    container.innerHTML="";
    let canvas=document.createElement("canvas"); canvas.width=400; canvas.height=400;
    container.appendChild(canvas);
    const ctx=canvas.getContext("2d");

    let player={x:180,y:360,width:40,height:20};
    let bullets=[], enemies=[];
    for(let i=0;i<5;i++) enemies.push({x:i*70,y:50,width:40,height:20});

    function loop(){
        ctx.fillStyle="#0f172a"; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle="lime"; ctx.fillRect(player.x,player.y,player.width,player.height);

        bullets.forEach((b,i)=>{ b.y-=5; ctx.fillRect(b.x,b.y,5,10); enemies.forEach((e,j)=>{ if(b.x>e.x && b.x<e.x+e.width && b.y>e.y && b.y<e.y+e.height){ enemies.splice(j,1); bullets.splice(i,1); } }); });

        enemies.forEach(e=>{ ctx.fillStyle="red"; ctx.fillRect(e.x,e.y,e.width,e.height); e.y+=0.2; });

        document.addEventListener("keydown",e=>{ if(e.key==="ArrowLeft") player.x-=5; if(e.key==="ArrowRight") player.x+=5; if(e.key===" ") bullets.push({x:player.x+player.width/2,y:player.y}); });
        requestAnimationFrame(loop);
    }

    loop();
}

// ============================
// JOGO PUZZLE DE CORES
// ============================
function jogoPuzzleCores(container){
    container.innerHTML="";
    let colors=["red","blue","green","yellow"];
    let sequence=[], playerSeq=[];
    let round=0;

    function nextRound(){
        let random=colors[Math.floor(Math.random()*colors.length)];
        sequence.push(random); playerSeq=[];
        draw();
    }

    function draw(){
        container.innerHTML="";
        colors.forEach(c=>{
            let btn=document.createElement("div"); btn.style.cssText=`width:80px;height:80px;background:${c};display:inline-block;margin:5px;cursor:pointer;`;
            btn.onclick=function(){ playerSeq.push(c); check(); };
            container.appendChild(btn);
        });
        let roundDiv=document.createElement("div"); roundDiv.textContent="Round: "+sequence.length; roundDiv.style.cssText="color:white;margin-top:10px;text-align:center;";
        container.appendChild(roundDiv);
    }

    function check(){
        for(let i=0;i<playerSeq.length;i++){ if(playerSeq[i]!==sequence[i]){ alert("💥 Game Over!"); sequence=[]; return nextRound(); } }
        if(playerSeq.length===sequence.length) setTimeout(nextRound,500);
    }

    nextRound();
}
</script>
