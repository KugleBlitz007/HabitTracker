document.addEventListener('DOMContentLoaded', function() {
  const habitBoxes = document.querySelectorAll('.habit-box');

  let habits = [];

  // Fetch data from PHP backend
  fetch('http://localhost:8888/get_habits.php')
    .then(response => response.json())
    .then(data => {
      habits = data;

      // Process habits
      habitBoxes.forEach((habitBox, index) => {
        const bars = habitBox.querySelectorAll('.progress-bar');
        const habitLevel = habitBox.querySelector('.habit-level');
        let progress = habits[index].progress;
        let level = habits[index].level;

        function updateHabitLevel(levelElement, level) {
          levelElement.textContent = level;
        }

        function saveProgress(habit) {
          fetch('http://localhost:8888/save_habit.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(habit)
          })
          .then(response => response.text())
          .then(data => {
            console.log('Progress saved:', data);
          })
          .catch(error => {
            console.error('Error saving progress:', error);
          });
        }

        // Initial rendering of bars based on progress
        bars.forEach((bar, barIndex) => {
          if (barIndex < progress) {
            bar.classList.add('clicked');
          }

          bar.addEventListener('click', function() {
            if (bar.classList.contains('clicked')) {
              bar.classList.remove('clicked');
              progress -= 1;
            } else {
              bar.classList.add('clicked');
              progress += 1;
            }
            habits[index].progress = progress;

            // Check if all bars are clicked
            if (progress === bars.length) {
              level += 1;
              progress = 0; // Reset progress
              bars.forEach(b => b.classList.remove('clicked'));
              habits[index].progress = progress;
              habits[index].level = level;
            }

            updateHabitLevel(habitLevel, level);
            saveProgress(habits[index]);

            console.log(`Habit ID: ${habits[index].id}, Progress: ${habits[index].progress}, Level: ${habits[index].level}`);
          });
        });

        // Editable habit level
        habitLevel.setAttribute('contenteditable', 'true');
        habitLevel.addEventListener('blur', function() {
          const newLevel = parseInt(habitLevel.textContent, 10);
          if (!isNaN(newLevel) && newLevel !== level) {
            level = newLevel;
            habits[index].level = level;
            saveProgress(habits[index]);
          } else {
            updateHabitLevel(habitLevel, level);
          }
        });

        updateHabitLevel(habitLevel, level);
      });
    });

  // Save progress to backend
  function saveProgress(habit) {
    fetch('http://localhost:8888/save_habit.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(habit)
    })
    .then(response => response.text())
    .then(data => {
      console.log('Progress saved:', data);
    })
    .catch(error => {
      console.error('Error saving progress:', error);
    });
  }
});