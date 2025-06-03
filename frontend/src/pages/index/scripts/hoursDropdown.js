document.addEventListener('DOMContentLoaded', function() {
  // Set your real store hours here:
  const storeHours = {
    Sunday:    '9:00 AM - 5:00 PM',
    Monday:    '9:00 AM - 5:00 PM',
    Tuesday:   '9:00 AM - 5:00 PM',
    Wednesday: '9:00 AM - 5:00 PM',
    Thursday:  '9:00 AM - 5:00 PM',
    Friday:    '9:00 AM - 5:00 PM',
    Saturday:  '9:00 AM - 5:00 PM',
  };

  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const todayName = days[new Date().getDay()];

  const selectedDayEl   = document.getElementById('selectedDay');
  const allHoursEl      = document.getElementById('allHours');
  const hoursDropdownEl = document.getElementById('hoursDropdown');

  // Show today’s hours in the collapsed header
  selectedDayEl.textContent = `${todayName}: ${storeHours[todayName]}`;

  // Build full-week list
  days.forEach(day => {
    const li = document.createElement('li');
    li.textContent = `${day}: ${storeHours[day]}`;
    allHoursEl.appendChild(li);
  });

  // Toggle expanded/collapsed
  selectedDayEl.addEventListener('click', () => {
    hoursDropdownEl.classList.toggle('expanded');
  });
});