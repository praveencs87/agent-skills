Analyze log files to find errors, patterns, and anomalies.

## Commands
- **Tail logs**: `tail -f <logfile>` or `tail -n 100 <logfile>`
- **Find errors**: `grep -i "error\|fail\|exception\|fatal" <logfile>`
- **Count by level**: `grep -c "ERROR" <logfile>`
- **Time range**: `awk '/2024-01-15 10:00/,/2024-01-15 11:00/' <logfile>`
- **Top errors**: `grep "ERROR" <logfile> | sort | uniq -c | sort -rn | head -10`

## Output
Provide a structured summary:
- Total lines analyzed
- Error count by severity (ERROR, WARN, INFO)
- Top 5 most frequent errors
- Timeline of error spikes (if time-stamped)
- Recommended actions
