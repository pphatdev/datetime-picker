document.addEventListener('DOMContentLoaded', function () {
    let currentDate: Date = new Date();
    const monthSelect = document.getElementById('month-select') as HTMLSelectElement;
    const yearSelect = document.getElementById('year-select') as HTMLSelectElement;
    const timeSelect = document.getElementById('time-select') as HTMLSelectElement;
    const calendarGrid = document.getElementById('calendar-grid') as HTMLDivElement;
    const timeList = document.getElementById('time-list') as HTMLDivElement;
    const selectedDateTime = document.querySelector('.selected-datetime') as HTMLDivElement;
    const datetimeInput = document.getElementById('datetime-input') as HTMLInputElement;
    const picker = document.getElementById('datetime-picker') as HTMLDivElement;

    // Initialize selectors
    function initializeSelectors(): void {
        // Months
        const months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        monthSelect.innerHTML = months.map((month, index) =>
            `<option value="${index}" ${index === currentDate.getMonth() ? 'selected' : ''}>
                ${month}
            </option>`
        ).join('');

        // Years (2020-2030)
        const currentYear: number = currentDate.getFullYear();
        yearSelect.innerHTML = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)
            .map(year =>
                `<option value="${year}" ${year === currentYear ? 'selected' : ''}>
                    ${year}
                </option>`
            ).join('');

        // Time slots (15-minute intervals)
        const timeSlots: string[] = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const timeString: string = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
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
    function generateCalendar(): void {
        const year: number = currentDate.getFullYear();
        const month: number = currentDate.getMonth();
        const firstDay: Date = new Date(year, month, 1);
        const lastDay: Date = new Date(year, month + 1, 0);
        const startingDay: number = firstDay.getDay();

        const prevMonthDays: string[] = [];
        const prevMonthLastDay: number = new Date(year, month, 0).getDate();
        for (let i = prevMonthLastDay - startingDay + 1; i <= prevMonthLastDay; i++) {
            prevMonthDays.push(`<div class="calendar-day other-month">${i}</div>`);
        }

        const currentMonthDays: string[] = [];
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const isSelected: boolean = i === currentDate.getDate() &&
                month === currentDate.getMonth() &&
                year === currentDate.getFullYear();
            currentMonthDays.push(
                `<div class="calendar-day ${isSelected ? 'selected' : ''}" data-date="${i}">
                    ${i}
                </div>`
            );
        }

        const totalDays: number = prevMonthDays.length + currentMonthDays.length;
        const nextMonthDays: string[] = [];
        for (let i = 1; i <= (42 - totalDays); i++) {
            nextMonthDays.push(`<div class="calendar-day other-month">${i}</div>`);
        }

        calendarGrid.innerHTML = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays].join('');
    }

    function updateSelectedDateTime(): void {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        const formattedDate: string = currentDate.toLocaleDateString('en-US', options)
            .replace(',', 'th,');
        selectedDateTime.textContent = formattedDate;
        datetimeInput.value = formattedDate;
    }

    function togglePicker(): void {
        picker.classList.toggle('active');
    }

    function handleClickOutside(event: MouseEvent): void {
        if (!picker.contains(event.target as Node) && event.target !== datetimeInput) {
            picker.classList.remove('active');
        }
    }

    // Event Listeners
    datetimeInput.addEventListener('click', (e: MouseEvent) => {
        e.stopPropagation();
        togglePicker();
    });

    document.addEventListener('click', handleClickOutside);

    monthSelect.addEventListener('change', (e: Event) => {
        currentDate.setMonth(parseInt((e.target as HTMLSelectElement).value));
        generateCalendar();
        updateSelectedDateTime();
    });

    yearSelect.addEventListener('change', (e: Event) => {
        currentDate.setFullYear(parseInt((e.target as HTMLSelectElement).value));
        generateCalendar();
        updateSelectedDateTime();
    });

    calendarGrid.addEventListener('click', (e: MouseEvent) => {
        const day = (e.target as Element).closest('.calendar-day');
        if (day && !day.classList.contains('other-month')) {
            document.querySelector('.calendar-day.selected')?.classList.remove('selected');
            day.classList.add('selected');
            currentDate.setDate(parseInt(day.getAttribute('data-date') || '1'));
            updateSelectedDateTime();
        }
    });

    timeList.addEventListener('click', (e: MouseEvent) => {
        const timeOption = (e.target as Element).closest('.time-option');
        if (timeOption) {
            document.querySelector('.time-option.selected')?.classList.remove('selected');
            timeOption.classList.add('selected');
            const [hours, minutes] = (timeOption.getAttribute('data-time') || '00:00').split(':');
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
