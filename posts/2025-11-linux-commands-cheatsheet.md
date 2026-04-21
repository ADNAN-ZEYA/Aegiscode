---
title: "Linux Commands Cheatsheet – Complete Beginner to Intermediate Guide (2025)"
slug: "linux-commands-cheatsheet-beginner-to-intermediate"
date: "2025-12-14"
author: "AegisCode"
category: "Linux"
tags:
  - Linux
  - DevOps
  - Cybersecurity
  - Beginners
description: "A clean Linux commands cheatsheet written in README.md style for beginners, developers, and cybersecurity learners."
image: "/images/OIP (1).jpg"
---

# Linux Commands Cheatsheet
## Beginner to Intermediate Guide

Linux is the backbone of **servers, cloud platforms, DevOps, and cybersecurity systems**.  
If you want to work seriously in tech, **Linux command-line skills are mandatory**.

This cheatsheet is designed for:
- Beginners learning Linux
- Developers and DevOps engineers
- Cybersecurity students
- Quick daily reference

---

## 📁 File & Directory Management

Commands to navigate and manage the Linux file system.

- `pwd` — print current working directory  
- `ls` — list files and directories  
- `ls -l` — detailed list (permissions, owner, size)  
- `ls -la` — include hidden files  
- `cd folder_name` — move into a directory  
- `cd ..` — move one level up  
- `cd ~` — go to home directory  
- `mkdir folder` — create a directory  
- `mkdir -p a/b/c` — create nested directories  
- `rmdir folder` — delete empty directory  
- `rm -r folder` — delete directory  
- `rm -rf folder` — force delete directory ⚠️  

---

## 📄 File Operations

Create, copy, move, delete, and view files.

- `touch file.txt` — create empty file  
- `cp file1 file2` — copy file  
- `cp -r dir1 dir2` — copy directory  
- `mv file.txt newfile.txt` — rename file  
- `mv file.txt /path/` — move file  
- `rm file.txt` — delete file  
- `cat file.txt` — display file content  
- `less file.txt` — view file page by page  
- `head file.txt` — show first 10 lines  
- `tail file.txt` — show last 10 lines  
- `tail -f file.txt` — live log monitoring  

---

## 🔍 Search & Text Processing

Search and filter text efficiently.

- `grep "word" file.txt` — search text in file  
- `grep -i "word" file.txt` — case-insensitive search  
- `grep -R "word" .` — recursive search  
- `find . -name file.txt` — find file by name  
- `find / -type f -size +100M` — find large files  
- `wc -l file.txt` — count lines  
- `sort file.txt` — sort file content  
- `uniq file.txt` — remove duplicate lines  

---

## 🔐 Permissions & Ownership

Control access to files and directories.

- `ls -l` — view file permissions  
- `chmod 755 file` — change file permissions  
- `chmod +x script.sh` — make script executable  
- `chown user file` — change file owner  
- `chown user:group file` — change owner and group  

Permission meanings:
- `r` → read  
- `w` → write  
- `x` → execute  

---

## 👤 User & System Information

View user and system details.

- `whoami` — current logged-in user  
- `id` — user ID and groups  
- `uname -a` — system information  
- `hostname` — system hostname  
- `uptime` — system running time  

Process management:
- `top` — live process monitor  
- `htop` — advanced process viewer  
- `ps aux` — list all running processes  
- `kill PID` — terminate a process  

---

## 💾 Disk & Memory Management

Monitor system storage and memory.

- `df -h` — disk usage  
- `du -sh folder` — folder size  
- `lsblk` — list block devices  
- `mount` — mounted filesystems  
- `free -h` — memory usage  

---

## 📦 Package Management (Debian / Ubuntu)

Install and manage software packages.

- `sudo apt update` — update package list  
- `sudo apt upgrade` — upgrade installed packages  
- `sudo apt install package` — install a package  
- `sudo apt remove package` — remove a package  
- `apt search package` — search for packages  

---

## 🌐 Networking Commands

Essential commands for servers and troubleshooting.

- `ip a` — show IP addresses  
- `ping google.com` — test network connectivity  
- `netstat -tulpn` — list open ports  
- `ss -tulpn` — modern alternative to netstat  
- `curl url` — fetch data from a URL  
- `wget url` — download files  

---

## 🗜️ Archive & Compression

Work with compressed files.

- `tar -cvf file.tar folder` — create tar archive  
- `tar -xvf file.tar` — extract tar archive  
- `tar -czvf file.tar.gz folder` — create gzip archive  
- `zip -r file.zip folder` — create zip archive  
- `unzip file.zip` — extract zip archive  

---

## ⚙️ Environment & Shell Productivity

Improve terminal efficiency.

- `echo $PATH` — display PATH variable  
- `env` — list environment variables  
- `export VAR=value` — set environment variable  
- `history` — view command history  
- `clear` — clear terminal screen  
- `alias ll='ls -la'` — create command alias  

---

## 🚀 Common Developer & Server Commands

Used in production and DevOps workflows.

- `ssh user@server_ip` — connect to remote server  
- `scp file user@ip:/path` — copy file to server  
- `crontab -e` — schedule recurring jobs  
- `systemctl status service` — check service status  
- `systemctl start service` — start a service  
- `systemctl stop service` — stop a service  

---

## ✅ Final Notes from AegisCode

- Practice Linux commands daily  
- Do not memorize blindly — use them  
- Linux + DevOps + Cybersecurity = strong career advantage  
- Terminal confidence separates beginners from professionals  

---

### 📌 More from AegisCode

- Linux for Cybersecurity  
- Linux for DevOps  
- Shell Scripting  
- Server Hardening  

Follow **AegisCode** for clean, practical, real-world learning.
