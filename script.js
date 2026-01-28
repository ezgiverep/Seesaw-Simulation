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