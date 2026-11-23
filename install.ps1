# Adds this repo's plugin folder to an OpenCode config file.
# Default is the global config; pass -Config for a project opencode.json.
#   powershell -ExecutionPolicy Bypass -File install.ps1
#   powershell -ExecutionPolicy Bypass -File install.ps1 -Config .\opencode.json
[CmdletBinding()]
param(
    [string]$Config = (Join-Path $env:USERPROFILE '.config\opencode\opencode.json')
)

$ErrorActionPreference = 'Stop'
$pluginDir = Join-Path $PSScriptRoot 'deepseek-peak'
if (-not (Test-Path (Join-Path $pluginDir 'index.mjs'))) {
    throw "Plugin not found: $pluginDir"
}
$plugin = $pluginDir.Replace('\', '/')

$fullConfig = [IO.Path]::GetFullPath($Config)
$configDir = Split-Path -Parent $fullConfig
if (-not (Test-Path $configDir)) {
    New-Item -ItemType Directory -Path $configDir -Force | Out-Null
}

if (Test-Path $fullConfig) {
    Copy-Item $fullConfig "$fullConfig.bak" -Force
    $raw = Get-Content $fullConfig -Raw
} else {
    $raw = ''
}

if ($raw.Trim()) {
    try {
        $configJson = $raw | ConvertFrom-Json
    } catch {
        throw "Cannot parse $fullConfig as JSON. Add this path to plugins by hand: $plugin"
    }
} else {
    $configJson = [pscustomobject]@{ '$schema' = 'https://opencode.ai/config.json' }
}

$plugins = @($configJson.plugins | Where-Object { $_ })
if ($plugins -contains $plugin) {
    "Already in $fullConfig : $plugin"
    return
}

$configJson | Add-Member -NotePropertyName plugins -NotePropertyValue @($plugins + $plugin) -Force
$text = $configJson | ConvertTo-Json -Depth 100
[IO.File]::WriteAllText($fullConfig, $text, (New-Object Text.UTF8Encoding($false)))
"Added to $fullConfig : $plugin"
