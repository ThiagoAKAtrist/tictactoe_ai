let boxes = document.querySelectorAll(".box");

let turn = "X";
let isGameOver = false;
let isGameStarted = false;


const normalButton = document.getElementById("normal-difficulty");
const impossibleButton = document.getElementById("impossible-difficulty");


normalButton.addEventListener("click", () => {
    selectDifficulty("normal");
    
});

impossibleButton.addEventListener("click", () => {
    selectDifficulty("impossible");
    
});



function selectDifficulty(difficulty) {
    if (difficulty === "normal") {
        normalButton.style.backgroundColor = "darkcyan";
        impossibleButton.style.backgroundColor = "";
        computerDifficulty = 2;

    } else if (difficulty === "impossible") {
        normalButton.style.backgroundColor = "";
        impossibleButton.style.backgroundColor = "darkcyan";
        computerDifficulty = 10;
    }
}





boxes.forEach(e => {
    e.innerHTML = "";
    e.addEventListener("click", () => {
        if (!isGameOver && e.innerHTML === "") {
            e.innerHTML = turn;
            checkWin();
            checkDraw();
            changeTurn();
            if (turn === "O" && !isGameOver) {
                computerMoveWithDelay();
            }
        }
    });
});



function changeTurn() {
    if (turn === "X") {
        turn = "O";
        document.querySelector(".background").style.left = "85px";
    } else {
        turn = "X";
        document.querySelector(".background").style.left = "0px";
    }
}

function checkWin() {
    let winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < winConditions.length; i++) {
        let v0 = boxes[winConditions[i][0]].innerHTML;
        let v1 = boxes[winConditions[i][1]].innerHTML;
        let v2 = boxes[winConditions[i][2]].innerHTML;

        if (v0 !== "" && v0 === v1 && v0 === v2) {
            isGameOver = true;
            document.querySelector("#results").innerHTML = turn + " wins!";
            document.querySelector("#play-again").style.display = "inline";

            for (j = 0; j < 3; j++) {
                boxes[winConditions[i][j]].style.backgroundColor = "darkcyan";
                boxes[winConditions[i][j]].style.color = "black";
            }
        }
    }
}

function checkDraw() {
    if (!isGameOver) {
        let isDraw = true;
        boxes.forEach(e => {
            if (e.innerHTML === "") isDraw = false;
        });

        if (isDraw) {
            isGameOver = true;
            document.querySelector("#results").innerHTML = "Game tied!";
            document.querySelector("#play-again").style.display = "inline";
        }
    }
}

function computerMoveWithDelay() {
    if (isGameOver) return;

    maxDepth = computerDifficulty;
    // Adicione um atraso de 1.5 segundos antes de chamar a função computerMove
    setTimeout(() => {
        computerMove(maxDepth);
    }, 1500);
}

function computerMove(maxDepth) {
    if (isGameOver) return;

    let bestScore = -Infinity;
    let bestMove;

    for (let simulated = 0; simulated < boxes.length; simulated++) {
        if (boxes[simulated].innerHTML === "") {
            boxes[simulated].innerHTML = "O";

            let score = minimax(boxes, 0, false, maxDepth);
            
            boxes[simulated].innerHTML = "";

            if (score > bestScore) {
                bestScore = score;
                bestMove = simulated;

            }
        }
    }

    boxes[bestMove].innerHTML = "O";
    checkWin();
    checkDraw();
    changeTurn();
}

function minimax(board, depth, isMaximizing, maxDepth) {
    
    let scores = {
        X: -1,
        O: 1,
        tie: 0
    };

    let result = checkGameResult(board);
    if (result !== null) {
        return scores[result];
    }

    if (depth >= maxDepth || result !== null){
        return[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let simulated = 0; simulated < board.length; simulated++) {
            if (board[simulated].innerHTML === "") {
                board[simulated].innerHTML = "O";
                let score = minimax(board, depth + 1, false, maxDepth);
                board[simulated].innerHTML = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let simulated = 0; simulated < board.length; simulated++) {
            if (board[simulated].innerHTML === "") {
                board[simulated].innerHTML = "X";
                let score = minimax(board, depth + 1, true, maxDepth);
                board[simulated].innerHTML = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkGameResult(board) {
    let winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    for (let condition of winConditions) {
        let [a, b, c] = condition;
        if (board[a].innerHTML !== "" && board[a].innerHTML === board[b].innerHTML && board[a].innerHTML === board[c].innerHTML) {
            return board[a].innerHTML;
        }
    }

    for (let box of board) {
        if (box.innerHTML === "") {
            return null;
        }
    }

    return "tie";
}


document.querySelector("#play-again").addEventListener("click", () => {
    isGameOver = false;
    turn = "X";
    rounds = 0;
    document.querySelector(".background").style.left = "0";
    document.querySelector("#results").innerHTML = "";
    document.querySelector("#play-again").style.display = "none";

    boxes.forEach(e => {
        e.innerHTML = "";
        e.style.removeProperty("background-color");
        e.style.color = "#fff";
    });
});
