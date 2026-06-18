$path = "style.css"
$content = Get-Content $path -Raw
$regex = [regex]'(?s)/\* Chart CSS Ported from Junior \*/.*?\.lr-day-item\.highlight-orange \{'
$replacement = @"
/* Chart CSS Ported from Junior */
.top-purple-bar {
    width: 378px;
    height: 40px;
    background-color: #8e8ebb;
    flex-shrink: 0;
}

.square-chart {
    width: auto;
    height: auto;
    background: #fff; /* The White Breathing Space */
    padding: 6px;
    box-shadow: 0 4px 30px rgba(0,0,0,0.2);
    margin: 15px 0;
    border-radius: 4px;
}

/* Fix for Snapshot gray-layer bug */
.capturing .square-chart {
    box-shadow: none !important;
}

.chart-grid-container {
    display: grid;
    grid-template-columns: repeat(4, 91.5px);
    grid-template-rows: repeat(4, 110px);
    width: 366px;
    height: 440px;
    border: 1px solid #CCCCCC;
    background: #fff;
    box-sizing: border-box;
    position: relative; /* Fixed: Absolute children like flying-lines-layer will align to this grid */
}

.palace-box {
    border: 1px solid #ccc;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 2px 2px 2px 3px;
    box-sizing: border-box;
    overflow: hidden;
}

/* Row Extra: Aa+ Row (Daily Data) */
.aa-plus-row {
    font-size: 11px;
    color: var(--text-k63);
    height: 12px;
    display: flex;
    align-items: center;
    padding: 0 4px;
    white-space: nowrap;
    overflow: hidden;
}

.lr-day-item {
    margin-right: 2px;
}

.lr-day-item.highlight-orange {
"@
$newContent = $regex.Replace($content, $replacement, 1)
Set-Content $path -Value $newContent -NoNewline
