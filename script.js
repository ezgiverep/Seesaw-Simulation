const plank = document.getElementById('seesaw_plank');
const clickable_area = document.getElementById('seesaw_clickable');
const next_weight_display = document.getElementById('next_weight');
const left_weight_display = document.getElementById('left_weight');
const right_weight_display = document.getElementById('right_weight');
const tilt_angle_display = document.getElementById('tilt_angle');
const reset_btn = document.getElementById('reset-btn');
const log_container = document.getElementById('log');

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



init();
