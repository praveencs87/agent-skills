Organize files in a directory by type, date, or custom rules.

## Strategies
### By File Type
```
Documents/ → .pdf, .doc, .docx, .txt, .md
Images/    → .jpg, .jpeg, .png, .gif, .svg, .webp
Videos/    → .mp4, .avi, .mkv, .mov
Audio/     → .mp3, .wav, .flac, .aac
Code/      → .js, .ts, .py, .go, .rs, .java
Archives/  → .zip, .tar, .gz, .rar, .7z
Other/     → everything else
```

### By Date
Organize into `YYYY/MM/` folders based on file modification date.

### By Project
Group related files by detecting common prefixes or naming patterns.

## Steps
1. List all files in the target directory using `cmd.run` with `ls -la`
2. Analyze file extensions and names
3. Create destination folders using `cmd.run` with `mkdir -p`
4. Move files using `cmd.run` with `mv`
5. Report what was organized

## Safety
- Always show a preview of what will be moved BEFORE executing
- Never organize system directories (`/`, `/usr`, etc.)
- Skip hidden files (dotfiles) unless explicitly requested
- Ask for confirmation before moving files
