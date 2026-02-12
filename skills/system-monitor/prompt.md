Monitor system resources and report health status.

## Commands
- **CPU**: `top -bn1 | head -20` or `mpstat` (if sysstat installed)
- **Memory**: `free -h`
- **Disk**: `df -h`
- **Processes**: `ps aux --sort=-%cpu | head -15`
- **Network**: `ss -tunlp` or `netstat -tunlp`
- **Uptime**: `uptime`
- **OS Info**: `uname -a` and `cat /etc/os-release`

## Output
Present a clean dashboard-style summary:
```
🖥️ System Health Report
━━━━━━━━━━━━━━━━━━━━━
CPU:    45% used (4 cores)
Memory: 6.2GB / 16GB (39%)
Disk:   120GB / 500GB (24%)
Uptime: 3 days, 14 hours
Top Process: node (12% CPU)
```

## Alerts
- Flag if CPU > 80%
- Flag if Memory > 90%
- Flag if Disk > 85%
