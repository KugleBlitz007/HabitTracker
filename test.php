<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Calendar</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="css/styles-discussions.css?v=1.0"> <!-- Add a version query string -->
    <link rel="stylesheet" href="css/styles-test.css">
</head>
<body>

<div class="top-space">
        <!-- Future button layout can be added here -->
    </div>

    <div class="calendar-container">
        <div class="calendar">
        <div class='day-header' style='grid-row: 2;'>Mon</div>
                <div class='day-header' style='grid-row: 4;'>Wed</div>
                <div class='day-header' style='grid-row: 6;'>Fri</div>
                <div class='day-header' style='grid-row: 8;'>Sun</div>

            <div class='month-header' style='grid-column: 2 / span 4; text-align: left;grid-row: 1;'>Jan</div>
            <div class='month-header' style='grid-column: 6 / span 4; text-align: left;grid-row: 1;'>Feb</div>
            <div class='month-header' style='grid-column: 10 / span 5; text-align: left; grid-row: 1;'>Mar</div>
            <div class='month-header' style='grid-column: 15 / span 4; text-align: left; grid-row: 1;'>Apr</div>
            <div class='month-header' style='grid-column: 19 / span 4; text-align: left;grid-row: 1;'>May</div>
            <div class='month-header' style='grid-column: 23 / span 5; text-align: left;grid-row: 1;'>Jun</div>
            <div class='month-header' style='grid-column: 28 / span 4; text-align: left;grid-row: 1;'>Jul</div>
            <div class='month-header' style='grid-column: 32 / span 4; text-align: left;grid-row: 1;'>Aug</div>
            <div class='month-header' style='grid-column: 36 / span 5; text-align: left;grid-row: 1;'>Sep</div>
            <div class='month-header' style='grid-column: 41 / span 4; text-align: left;grid-row: 1;'>Oct</div>
            <div class='month-header' style='grid-column: 45 / span 4; text-align: left;grid-row: 1;'>Nov</div>
            <div class='month-header' style='grid-column: 49 / span 9; text-align: left;grid-row: 1;'>Dec</div>


            <?php
            include 'db_config.php';

          
                


            $sql = "SELECT date, progress FROM habit_calendar ORDER BY date";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                $start_date = new DateTime('2024-01-01');
                $end_date = new DateTime('2024-12-31');
                $interval = new DateInterval('P1D');
                $date_range = new DatePeriod($start_date, $interval, $end_date->modify('+1 day'));

                // Get today's date from JavaScript
                $today = isset($_GET['today']) ? $_GET['today'] : (new DateTime())->format('Y-m-d');

                foreach ($date_range as $date) {
                    $formatted_date = $date->format('Y-m-d');
                    $progress = 0;

                    // Find the progress for the current date
                    foreach ($result as $row) {
                        if ($row['date'] == $formatted_date) {
                            $progress = $row['progress'];
                            break;
                        }
                    }

                    // Add the appropriate progress class
                    $progress_class = $progress > 0 ? "progress-$progress" : "";
                    $today_class = $formatted_date == $today ? "today" : "";

                    echo "<div class='day $progress_class $today_class' data-date='$formatted_date' data-progress='$progress'></div>";
                }
            } else {
                echo "No data found";
            }

            $conn->close();
            ?>
        </div>
    </div>

    <div class="container">
        <div id="round-box" class="round-box">
            <img id="round-box-img" src="images/add-icon.png" alt="Image Description">
        </div>
        <div class="rectangle-box" contenteditable="true" id="text-box">
            Habits
            <div class="check-button" id="check-button"  contenteditable="false">‎</div>
        </div>
    </div>
    <div id="output-container" style="width: 100%; padding-left: 70px;"></div> <!-- Container for new elements -->
    <div id="image-modal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Select an Image</h2>
            <div class="image-list">
                <img src="images/icons/Johann.jpg" alt="Image 1" class="selectable-image">
                <img src="images/icons/Ticia.jpg" alt="Image 2" class="selectable-image">
                <img src="images/icons/Titinana.jpg" alt="Image 3" class="selectable-image">
                <!-- Add more images as needed -->
            </div>
        </div>
    </div>
    <script src="js/script-test.js"></script>
    <script>
        // Get today's date in GMT-04:00
        const today = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
        const todayDate = new Date(today).toISOString().split('T')[0];

        // Reload the page with today's date as a query parameter
        if (!window.location.search.includes('today')) {
            window.location.href = window.location.pathname + '?today=' + todayDate;
        }
    </script>
</body>
</html>

