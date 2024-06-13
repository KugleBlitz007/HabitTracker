document.addEventListener('DOMContentLoaded', function() {
    const habitBoxes = document.querySelectorAll('.habit-box');
  
    let habits = [];
  
    // Fetch data from backend
    fetch('http://localhost:8080/habits')
      .then(response => response.json())
      .then(data => {
        habits = data;
  
        // Process habits
        habitBoxes.forEach((habitBox, index) => {
          const bars = habitBox.querySelectorAll('.progress-bar');
          const habitLevel = habitBox.querySelector('.habit-level');
          let progress = habits[index].progress;
          let level = habits[index].level;
  
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
              if (progress === bars.length) {
                level += 1;
                progress = 0;
                bars.forEach(b => b.classList.remove('clicked'));
                habits[index].progress = progress;
                habits[index].level = level;
              }
              updateHabitLevel(habitLevel, level);
              saveProgress(habits[index]);
            });
          });
  
          function updateHabitLevel(levelElement, level) {
            levelElement.textContent = level;
          }
  
          habitLevel.setAttribute('contenteditable', 'true');
          habitLevel.addEventListener('blur', function() {
            level = parseInt(habitLevel.textContent);
            habits[index].level = level;
            saveProgress(habits[index]);
          });
  
          updateHabitLevel(habitLevel, level);
        });
      });
  
    // Save progress to backend
    function saveProgress(habit) {
      fetch('http://localhost:5001/habits', {
        method: 'PUT',
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