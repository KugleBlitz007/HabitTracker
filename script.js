document.addEventListener('DOMContentLoaded', function() {
    const habitBoxes = document.querySelectorAll('.habit-box');

    // Initialize Firebase Authentication and Firestore
    firebase.auth().signInAnonymously().catch(function(error) {
        console.error('Firebase auth error', error.code, error.message);
    });

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            const userId = user.uid;
            const db = firebase.firestore();

            habitBoxes.forEach((habitBox, index) => {
                const bars = habitBox.querySelectorAll('.progress-bar');
                const habitLevel = habitBox.querySelector('.habit-level');

                db.collection('users').doc(userId).get().then((doc) => {
                    if (doc.exists) {
                        const data = doc.data();
                        const progress = data[`progress-${index}`] || 0;
                        const level = data[`level-${index}`] || 0;

                        bars.forEach((bar, barIndex) => {
                            if (barIndex < progress) {
                                bar.classList.add('clicked');
                            }

                            bar.addEventListener('click', function() {
                                if (!bar.classList.contains('clicked')) {
                                    bar.classList.add('clicked');
                                    updateProgress(index, bars, db, userId, habitLevel);
                                }
                            });
                        });

                        updateHabitLevel(habitLevel, level);
                    }
                });
            });

            function updateProgress(index, bars, db, userId, habitLevel) {
                let progress = 0;
                bars.forEach(bar => {
                    if (bar.classList.contains('clicked')) {
                        progress++;
                    }
                });

                let level = parseInt(habitLevel.textContent) || 0;
                if (progress === bars.length) {
                    level++;
                    progress = 0;
                    bars.forEach(b => b.classList.remove('clicked'));
                }

                db.collection('users').doc(userId).set({
                    [`progress-${index}`]: progress,
                    [`level-${index}`]: level
                }, { merge: true });

                updateHabitLevel(habitLevel, level);
            }

            function updateHabitLevel(levelElement, level) {
                levelElement.textContent = level;
            }
        }
    });
});