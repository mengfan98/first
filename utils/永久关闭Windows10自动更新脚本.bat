@echo off  
  
echo shuting down the Windows update...  
  
:: stoping Windows Update service  
net stop wuauserv  
  
:: disable Windows Update   
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Windows Update\Auto Update" /v AUOptions /t REG_DWORD /d 4 /f  
  
:: disable Windows Update checking  
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Windows Update\Auto Update" /v Elevated /t REG_DWORD /d 0 /f  
  
echo Windows update had been disabled  
echo please reboot your pc to make it work!!!
  
pause