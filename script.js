const plank = document.getElementById('seesaw_plank');
const clickable_area = document.getElementById('seesaw_clickable');
const next_weight_display = document.getElementById('next_weight');
const left_weight_display = document.getElementById('left_weight');
const right_weight_display = document.getElementById('right_weight');
const tilt_angle_display = document.getElementById('tilt_angle');
const reset_btn = document.getElementById('reset-btn');
const log_container = document.getElementById('log');
const drop_sound = new Audio('assets/select-button-ui-395763.mp3');
drop_sound.volume = 0.5;
const modal = document.getElementById('custom-modal');
const confirm_btn = document.getElementById('modal-confirm');
const cancel_btn = document.getElementById('modal-cancel');

let state = {
    left_torque: 0,
    right_torque: 0,
    left_total_weight: 0,
    right_total_weight: 0,
    next_weight: Math.floor(Math.random() * 10) + 1, //1-10 kg
    placed_items: []
};

function init() {
    const saved_data = localStorage.getItem('seesaw_save'); //get saved state 
    if (saved_data) {                                       // if any
        state = JSON.parse(saved_data);
        state.placed_items.forEach(item => createObjectUI(item));
    }
    updateUI();

    clickable_area.addEventListener('click', handleSeesawClick); // handle clicks
    reset_btn.addEventListener('click', resetGame);              // handle reset
}

function handleSeesawClick(e) {
    const rect = clickable_area.getBoundingClientRect();
    const click_x = e.clientX - rect.left; 
    const center_x = rect.width / 2;                         // get center

    const distance_from_center = click_x - center_x;        
    const current_weight = state.next_weight;
    const side= distance_from_center < 0 ? 'left' : 'right';
    const display_distance = Math.abs(distance_from_center).toFixed(0); // add proper log


    const new_item = {
        weight: current_weight,
        distance: distance_from_center,
        xPercent: (click_x / rect.width) * 100, 
        id: Date.now()
    };

    if (distance_from_center < 0) {                                           // left or right
        state.left_torque += current_weight * Math.abs(distance_from_center); 
        state.left_total_weight += current_weight;
    } else { 
        state.right_torque += current_weight * distance_from_center;
        state.right_total_weight += current_weight;
    }

    state.placed_items.push(new_item);
    state.next_weight = Math.floor(Math.random() * 10) + 1;

    drop_sound.currentTime = 0;
    drop_sound.play();

    createObjectUI(new_item);
    saveAndRefresh();
    addLog(`${current_weight}kg dropped on ${side} side at ${display_distance} px from center.`);

}

function createObjectUI(item) {
    const obj = document.createElement('div'); 
    obj.className = 'object';
    obj.innerText = item.weight; 
    
    obj.style.left = `${item.xPercent}%`;
    obj.style.bottom = '100%'; 
    obj.style.transform = 'translateX(-50%)'; 
    
    plank.appendChild(obj);
}

function saveAndRefresh() {
    const angle = Math.max(-30, Math.min(30, (state.right_torque - state.left_torque) / 10));
    
    plank.style.transform = `translateX(-50%) translateY(-50%) rotate(${angle.toFixed(2)}deg)`;   // limit angle
    
    left_weight_display.innerText = state.left_total_weight;
    right_weight_display.innerText = state.right_total_weight;
    next_weight_display.innerText = state.next_weight;
    tilt_angle_display.innerText = angle.toFixed(1);

    localStorage.setItem('seesaw_save', JSON.stringify(state));
}

function updateUI() {
    saveAndRefresh();
}

function addLog(message) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerText = `${message}`;
    log_container.prepend(entry);
}

function resetGame() {
    modal.classList.add('active');
    confirm_btn.onclick = function() {
        localStorage.removeItem('seesaw_save');
        location.reload();
    };
    cancel_btn.onclick = function() {
        modal.classList.remove('active');
    };
    window.onclick = function(event) {         // close modal on outside click
    if (event.target == modal) {
        modal.classList.remove('active');
    }
    };
}

init();
