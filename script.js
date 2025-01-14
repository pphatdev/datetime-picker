document.addEventListener('DOMContentLoaded', function () {
    let currentDate = new Date();
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const timeSelect = document.getElementById('time-select');
    const calendarGrid = document.getElementById('calendar-grid');
    const timeList = document.getElementById('time-list');
    const selectedDateTime = document.querySelector('.selected-datetime');
    const datetimeInput = document.getElementById('datetime-input');
    const picker = document.getElementById('datetime-picker');

    // Initialize selectors
    function initializeSelectors() {
        // Months
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        monthSelect.innerHTML = months.map((month, index) =>
            `<option value="${index}" ${index === currentDate.getMonth() ? 'selected' : ''}>
                ${month}
            </option>`
        ).join('');

        // Years (2020-2030)
        const currentYear = currentDate.getFullYear();
        yearSelect.innerHTML = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)
            .map(year =>
                `<option value="${year}" ${year === currentYear ? 'selected' : ''}>
                    ${year}
                </option>`
            ).join('');

        // Time slots (15-minute intervals)
        const timeSlots = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                timeSlots.push(timeString);
            }
        }

        timeList.innerHTML = timeSlots.map(time =>
            `<div class="time-option ${time === '05:00' ? 'selected' : ''}" data-time="${time}">
                ${time}
            </div>`
        ).join('');
    }

    // Generate calendar grid
    function generateCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDay = firstDay.getDay();

        // Previous month's days
        const prevMonthDays = [];
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = prevMonthLastDay - startingDay + 1; i <= prevMonthLastDay; i++) {
            prevMonthDays.push(`<div class="calendar-day other-month">${i}</div>`);
        }

        // Current month's days
        const currentMonthDays = [];
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const isSelected = i === currentDate.getDate() &&
                month === currentDate.getMonth() &&
                year === currentDate.getFullYear();
            currentMonthDays.push(
                `<div class="calendar-day ${isSelected ? 'selected' : ''}" data-date="${i}">
                    ${i}
                </div>`
            );
        }

        // Next month's days
        const totalDays = prevMonthDays.length + currentMonthDays.length;
        const nextMonthDays = [];
        for (let i = 1; i <= (42 - totalDays); i++) {
            nextMonthDays.push(`<div class="calendar-day other-month">${i}</div>`);
        }

        calendarGrid.innerHTML = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays].join('');
    }

    // Update selected datetime display
    function updateSelectedDateTime() {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        const formattedDate = currentDate.toLocaleDateString('en-US', options)
            .replace(',', 'th,');
        selectedDateTime.textContent = formattedDate;
        datetimeInput.value = formattedDate;
    }

    // Toggle picker visibility
    function togglePicker() {
        picker.classList.toggle('active');
    }

    // Close picker when clicking outside
    function handleClickOutside(event) {
        if (!picker.contains(event.target) && event.target !== datetimeInput) {
            picker.classList.remove('active');
        }
    }

    // Event Listeners
    datetimeInput.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePicker();
    });

    document.addEventListener('click', handleClickOutside);

    monthSelect.addEventListener('change', (e) => {
        currentDate.setMonth(parseInt(e.target.value));
        generateCalendar();
        updateSelectedDateTime();
    });

    yearSelect.addEventListener('change', (e) => {
        currentDate.setFullYear(parseInt(e.target.value));
        generateCalendar();
        updateSelectedDateTime();
    });

    calendarGrid.addEventListener('click', (e) => {
        const day = e.target.closest('.calendar-day');
        if (day && !day.classList.contains('other-month')) {
            document.querySelector('.calendar-day.selected')?.classList.remove('selected');
            day.classList.add('selected');
            currentDate.setDate(parseInt(day.dataset.date));
            updateSelectedDateTime();
        }
    });

    timeList.addEventListener('click', (e) => {
        const timeOption = e.target.closest('.time-option');
        if (timeOption) {
            document.querySelector('.time-option.selected')?.classList.remove('selected');
            timeOption.classList.add('selected');
            const [hours, minutes] = timeOption.dataset.time.split(':');
            currentDate.setHours(parseInt(hours));
            currentDate.setMinutes(parseInt(minutes));
            updateSelectedDateTime();
        }
    });

    // Initialize the picker
    initializeSelectors();
    generateCalendar();
    updateSelectedDateTime();
});

