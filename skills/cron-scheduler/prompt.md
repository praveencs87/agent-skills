Manage cron jobs for scheduling tasks.

## Commands
- **List**: `crontab -l`
- **Edit**: `crontab -e`
- **Add job**: `(crontab -l 2>/dev/null; echo "<schedule> <command>") | crontab -`
- **Remove all**: `crontab -r` (⚠️ dangerous, ask first)

## Cron Format
```
┌─── minute (0-59)
│ ┌─── hour (0-23)
│ │ ┌─── day of month (1-31)
│ │ │ ┌─── month (1-12)
│ │ │ │ ┌─── day of week (0-7, Sun=0/7)
│ │ │ │ │
* * * * * command
```

## Common Schedules
- Every minute: `* * * * *`
- Every hour: `0 * * * *`
- Daily at midnight: `0 0 * * *`
- Every Monday 9am: `0 9 * * 1`
- Every 5 minutes: `*/5 * * * *`
