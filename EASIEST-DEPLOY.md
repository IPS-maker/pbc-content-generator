# Deploy PBC in 2 clicks (almost)

## Step A — One-time: run the script

1. In File Explorer, open folder: **PBC-Content-Generator** on your Desktop.
2. **Right-click** `Deploy-PBC.ps1` → **Run with PowerShell**.  
   - If Windows blocks it: right-click → **Properties** → check **Unblock** → OK, then try again.  
   - Or open **PowerShell**, type:  
     `cd $env:USERPROFILE\Desktop\PBC-Content-Generator`  
     then:  
     `powershell -ExecutionPolicy Bypass -File .\Deploy-PBC.ps1`
3. When the **browser** opens, **log in to Vercel** (GitHub or email). That is one-time on this PC.
4. When the script finishes, it prints a line like **https://something.vercel.app** — that is the link for mentees.

## Step B — Google Sheet (in the browser, not in code)

1. Go to **vercel.com** → your new project → **Settings** → **Environment variables**.
2. Add **GOOGLE_SCRIPT_WEB_APP_URL** = your Apps Script web app URL (ends with `/exec`).
3. **Deployments** → **⋯** on the latest → **Redeploy**.

Without that variable, the site still runs; only **Submit to Google Sheet** will show an error.

## If you refuse scripts

Use only the website: **vercel.com** → **Add New Project** → import **IPS-maker/pbc-content-generator** → **Deploy** → then Step B above.

