<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/styles-habit.css">
    <title>Habit Tracker</title>
</head>
<body>
    <div class="stats-tracker">
        <div class="main-image-container">
            <img src="images/StatTracker_main.png" alt="Stat Tracker" class="main-image">
        </div>
    </div>
    <div class="habit-container">
        <?php
        include 'db_config.php';

        // Fetch habits from the database
        $sql = "SELECT id, icon, level, progress FROM habits";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            while($habit = $result->fetch_assoc()) {
                echo '<div class="habit-box" id="habit-' . $habit['id'] . '">';
                echo '    <div class="image-box">';
                echo '        <img src="images/' . $habit['icon'] . '" alt="Habit Icon">';
                echo '    </div>';
                echo '    <div class="progress-container">';
                echo '        <div class="habit-level" id="habit-level-' . $habit['id'] . '" contenteditable="true">' . $habit['level'] . '</div>';
                echo '        <div class="progress-bars">';
                for ($i = 1; $i <= 10; $i++) {
                    $clickedClass = ($i <= $habit['progress']) ? 'clicked' : '';
                    echo '            <div class="progress-bar ' . $clickedClass . '" id="bar-' . $habit['id'] . '-' . $i . '"></div>';
                }
                echo '        </div>';
                echo '    </div>';
                echo '</div>';
            }
        } else {
            echo "No habits found.";
        }

        $conn->close();
        ?>
    </div>
    <script src="js/script-habit.js"></script>
</body>
</html>