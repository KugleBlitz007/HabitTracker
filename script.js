document.addEventListener('DOMContentLoaded', function() {
    const habits = document.querySelectorAll('.habit');

    habits.forEach(habit => {
        const habitName = habit.dataset.habit;
        const bars = habit.querySelectorAll('.progress-bar');
        const habitLevel = habit.querySelector('.habit-level');

        let progress = parseInt(localStorage.getItem(`${habitName}Progress`) || '0');
        let level = parseInt(localStorage.getItem(`${habitName}Level`) || '0');

        bars.forEach((bar, index) => {
            if (index < progress) {
                bar.classList.add('clicked');
            }

            bar.addEventListener('click', function() {
                if (!bar.classList.contains('clicked')) {
                    bar.classList.add('clicked');
                    progress += 1;
                    localStorage.setItem(`${habitName}Progress`, progress);
                    if (progress === bars.length) {
                        level += 1;
                        progress = 0;
                        bars.forEach(b => b.classList.remove('clicked'));
                        localStorage.setItem(`${habitName}Progress`, progress);
                        localStorage.setItem(`${habitName}Level`, level);
                    }
                    updateHabitLevel(habitLevel, level);
                }
            });
        });

        function updateHabitLevel(levelElement, level) {
            levelElement.textContent = level;
        }

        updateHabitLevel(habitLevel, level);
    });
});
