function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position:fixed; bottom:20px; right:20px; z-index:99999; display:flex; flex-direction:column; gap:10px;';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    const bgColor = type === 'error' ? '#ff4757' : (type === 'warning' ? '#ffa502' : '#2ed573');
    const icon = type === 'error' ? '❌' : (type === 'warning' ? '⚠️' : '✅');
    
    toast.style.cssText = `
        background: ${bgColor}; 
        color: white; 
        padding: 12px 24px; 
        border-radius: 8px; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
        font-weight: 500; 
        transform: translateX(120%); 
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
        display:flex; 
        align-items:center; 
        gap:10px;
        font-family: inherit;
    `;
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    
    container.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
    });
    
    // Animate out
    setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

window.showToast = showToast;

window.alert = function(msg) {
    let type = 'success';
    const msgLower = String(msg).toLowerCase();
    if(msgLower.includes('error') || msgLower.includes('failed') || msgLower.includes('missing') || msgLower.includes('network')) {
        type = 'error';
    } else if (msgLower.includes('warning') || msgLower.includes('sure')) {
        type = 'warning';
    }
    // If msg is empty, don't show an alert (sometimes used as empty alert hooks)
    if (msg.trim() !== "") {
        showToast(msg, type);
    }
};

window.customConfirm = function(message) {
    return new Promise((resolve) => {
        let overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index:100000; display:flex; justify-content:center; align-items:center; opacity:0; transition:opacity 0.2s;';
        
        let modal = document.createElement('div');
        modal.style.cssText = 'background:#1e1e2d; color:#fff; padding:24px; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.5); text-align:center; min-width:300px; transform:scale(0.9); transition:transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); font-family:inherit;';
        
        let text = document.createElement('p');
        text.innerText = message;
        text.style.cssText = 'margin:0 0 24px 0; font-size:1.1rem; color:#d1d5db;';
        
        let btnContainer = document.createElement('div');
        btnContainer.style.cssText = 'display:flex; justify-content:center; gap:12px;';
        
        let btnYes = document.createElement('button');
        btnYes.innerText = 'Confirm';
        btnYes.style.cssText = 'background:#2ecc71; color:#fff; border:none; padding:10px 20px; border-radius:6px; font-weight:600; cursor:pointer; font-family:inherit; transition:background 0.2s;';
        btnYes.onmouseover = () => btnYes.style.background = '#27ae60';
        btnYes.onmouseout = () => btnYes.style.background = '#2ecc71';
        
        let btnNo = document.createElement('button');
        btnNo.innerText = 'Cancel';
        btnNo.style.cssText = 'background:#e74c3c; color:#fff; border:none; padding:10px 20px; border-radius:6px; font-weight:600; cursor:pointer; font-family:inherit; transition:background 0.2s;';
        btnNo.onmouseover = () => btnNo.style.background = '#c0392b';
        btnNo.onmouseout = () => btnNo.style.background = '#e74c3c';
        
        btnContainer.appendChild(btnNo);
        btnContainer.appendChild(btnYes);
        
        modal.appendChild(text);
        modal.appendChild(btnContainer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            modal.style.transform = 'scale(1)';
        });
        
        const cleanup = (result) => {
            overlay.style.opacity = '0';
            modal.style.transform = 'scale(0.9)';
            setTimeout(() => {
                overlay.remove();
                resolve(result);
            }, 200);
        };
        
        btnYes.onclick = () => cleanup(true);
        btnNo.onclick = () => cleanup(false);
    });
};
