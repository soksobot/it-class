document.addEventListener('DOMContentLoaded', function() {
    function initAuthModal() {
        const loginBtn = document.getElementById('loginBtn');
        const authModal = document.getElementById('authModal');
        
        if (!loginBtn || !authModal) return;
        
        const closeBtn = authModal.querySelector('.close');
        const toggleAuth = document.getElementById('toggleAuth');
        const authForm = document.getElementById('authForm');
        
        let isLoginMode = true;
        
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            authModal.style.display = 'block';
        });
        
        closeBtn.addEventListener('click', function() {
            authModal.style.display = 'none';
        });
        
        window.addEventListener('click', function(e) {
            if (e.target === authModal) {
                authModal.style.display = 'none';
            }
        });
        
        toggleAuth.addEventListener('click', function(e) {
            e.preventDefault();
            isLoginMode = !isLoginMode;
            const formTitle = authModal.querySelector('h2');
            const submitBtn = authModal.querySelector('button');
            
            if (isLoginMode) {
                formTitle.textContent = 'Вход';
                submitBtn.textContent = 'Войти';
                toggleAuth.textContent = 'Нет аккаунта? Зарегистрироваться';
            } else {
                formTitle.textContent = 'Регистрация';
                submitBtn.textContent = 'Зарегистрироваться';
                toggleAuth.textContent = 'Уже есть аккаунт? Войти';
            }
        });
        
        authForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (isLoginMode) {
                alert(`Вход выполнен для ${email}`);
            } else {
                alert(`Регистрация выполнена для ${email}`);
            }
            
            authModal.style.display = 'none';
        });
    }
    function initSortingSystem() {
    }

    initAuthModal(); 
    initSortingSystem();
});
let animationSpeed = 500;
let isSorting = false;
let animationId = null;

function initArray() {
    const canvas = document.getElementById('sortCanvas');
    const ctx = canvas.getContext('2d');
    const arraySize = 20;
    const maxValue = 100;
    let array = [];
    
    for (let i = 0; i < arraySize; i++) {
        array.push(Math.floor(Math.random() * maxValue) + 10);
    }
    
    drawArray(ctx, array);
    return array;
}

function drawArray(ctx, array, highlight1 = -1, highlight2 = -1) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    const barWidth = ctx.canvas.width / array.length - 2;
    const maxBarHeight = ctx.canvas.height - 20;
    
    for (let k = 0; k < array.length; k++) {
        const barHeight = (array[k] / 100) * maxBarHeight;
        const x = k * (barWidth + 2);
        const y = ctx.canvas.height - barHeight;
        
        if (k === highlight1 || k === highlight2) {
            ctx.fillStyle = '#34a853';
        } else {
            ctx.fillStyle = '#1a73e8';
        }
        
        ctx.fillRect(x, y, barWidth, barHeight);
        ctx.fillStyle = '#333';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(array[k], x + barWidth / 2, ctx.canvas.height - 5);
    }
}

async function delay() {
    return new Promise(resolve => {
        if (animationId) clearTimeout(animationId);
        animationId = setTimeout(resolve, animationSpeed);
    });
}

const algorithms = {
    bubble: async function(array, ctx) {
        let n = array.length;
        for (let i = 0; i < n-1; i++) {
            for (let j = 0; j < n-i-1; j++) {
                if (!isSorting) return;
                
                drawArray(ctx, array, j, j+1);
                await delay();
                
                if (array[j] > array[j+1]) {
                    [array[j], array[j+1]] = [array[j+1], array[j]];
                    drawArray(ctx, array, j, j+1);
                    await delay();
                }
            }
        }
    },
    
    selection: async function(array, ctx) {
        let n = array.length;
        for (let i = 0; i < n-1; i++) {
            let minIdx = i;
            for (let j = i+1; j < n; j++) {
                if (!isSorting) return;
                
                drawArray(ctx, array, minIdx, j);
                await delay();
                
                if (array[j] < array[minIdx]) {
                    minIdx = j;
                    drawArray(ctx, array, minIdx, j);
                    await delay();
                }
            }
            
            if (minIdx !== i) {
                [array[i], array[minIdx]] = [array[minIdx], array[i]];
                drawArray(ctx, array, i, minIdx);
                await delay();
            }
        }
    },
    
    insertion: async function(array, ctx) {
        let n = array.length;
        for (let i = 1; i < n; i++) {
            let key = array[i];
            let j = i-1;
            
            drawArray(ctx, array, i, j);
            await delay();
            
            while (j >= 0 && array[j] > key) {
                if (!isSorting) return;
                
                array[j+1] = array[j];
                drawArray(ctx, array, j+1, j);
                await delay();
                j--;
            }
            array[j+1] = key;
            drawArray(ctx, array);
            await delay();
        }
    },
    
    quick: async function(array, ctx) {
        async function partition(low, high) {
            let pivot = array[high];
            let i = low - 1;
            
            for (let j = low; j < high; j++) {
                if (!isSorting) return;
                
                drawArray(ctx, array, j, high);
                await delay();
                
                if (array[j] < pivot) {
                    i++;
                    [array[i], array[j]] = [array[j], array[i]];
                    drawArray(ctx, array, i, j);
                    await delay();
                }
            }
            
            [array[i+1], array[high]] = [array[high], array[i+1]];
            drawArray(ctx, array, i+1, high);
            await delay();
            return i+1;
        }
        
        async function quickSort(low, high) {
            if (low < high) {
                let pi = await partition(low, high);
                if (!isSorting) return;
                
                await quickSort(low, pi-1);
                await quickSort(pi+1, high);
            }
        }
        
        await quickSort(0, array.length-1);
    }
};
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('sortCanvas');
    const ctx = canvas.getContext('2d');
    let array = initArray();
    
    const speedControl = document.getElementById('speedControl');
    const speedValue = document.getElementById('speedValue');
    
    speedControl.addEventListener('input', function() {
        const speeds = [
            {value: 50, label: "Очень быстро"},
            {value: 200, label: "Быстро"},
            {value: 500, label: "Средняя"},
            {value: 800, label: "Медленно"},
            {value: 1000, label: "Очень медленно"}
        ];
        
        animationSpeed = 1050 - this.value; 
        
        const closest = speeds.reduce((prev, curr) => 
            Math.abs(curr.value - animationSpeed) < Math.abs(prev.value - animationSpeed) ? curr : prev
        );
        
        speedValue.textContent = closest.label;
    });
    document.getElementById('startSort').addEventListener('click', async function() {
        if (isSorting) return;
        
        isSorting = true;
        this.disabled = true;
        document.getElementById('resetArray').disabled = true;
        
        const sortType = document.getElementById('sortType').value;
        array = [...array]; 
        
        try {
            await algorithms[sortType](array, ctx);
        } finally {
            isSorting = false;
            this.disabled = false;
            document.getElementById('resetArray').disabled = false;
            drawArray(ctx, array);
        }
    });
    
    document.getElementById('resetArray').addEventListener('click', function() {
        if (isSorting) {
            isSorting = false;
            if (animationId) clearTimeout(animationId);
            document.getElementById('startSort').disabled = false;
        }
        
        array = initArray();
        this.disabled = false;
    });
});
