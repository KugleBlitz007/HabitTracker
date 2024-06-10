document.addEventListener('DOMContentLoaded', function() {
    const habitBoxes = document.querySelectorAll('.habit-box');

    habitBoxes.forEach((habitBox, index) => {
        const bars = habitBox.querySelectorAll('.progress-bar');
        const habitLevel = habitBox.querySelector('.habit-level');

        let progress = parseInt(localStorage.getItem(`progress-${index}`) || '0');
        let level = parseInt(localStorage.getItem(`level-${index}`) || '0');

        bars.forEach((bar, barIndex) => {
            if (barIndex < progress) {
                bar.classList.add('clicked');
            }

            bar.addEventListener('click', function() {
                if (!bar.classList.contains('clicked')) {
                    bar.classList.add('clicked');
                    progress += 1;
                    localStorage.setItem(`progress-${index}`, progress);
                    if (progress === bars.length) {
                        level += 1;
                        progress = 0;
                        bars.forEach(b => b.classList.remove('clicked'));
                        localStorage.setItem(`progress-${index}`, progress);
                        localStorage.setItem(`level-${index}`, level);
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