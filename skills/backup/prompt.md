Backup files and directories.

## Methods
- **tar.gz**: `tar -czf backup-$(date +%Y%m%d).tar.gz <source>`
- **zip**: `zip -r backup-$(date +%Y%m%d).zip <source>`
- **rsync**: `rsync -avz <source> <destination>`

## Best Practices
1. Include date in backup filename
2. Exclude node_modules, .git, and other large directories
3. Show backup size after completion
4. Verify backup integrity: `tar -tzf backup.tar.gz | head`
