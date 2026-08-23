# Genera par RSA de desarrollo para firma de licencias (no usar en producción).
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$priv = Join-Path $root 'ecunexo_api\dev-license-private.pem'
$pub = Join-Path $root 'ecunexo_api\dev-license-public.pem'

$cs = @'
using System.IO;
using System.Security.Cryptography;
var rsa = RSA.Create(2048);
File.WriteAllText(args[0], rsa.ExportPkcs8PrivateKeyPem());
File.WriteAllText(args[1], rsa.ExportSubjectPublicKeyInfoPem());
'@

$tmp = Join-Path $env:TEMP "ecunexo-keygen"
New-Item -ItemType Directory -Force -Path $tmp | Out-Null
Set-Content -Path (Join-Path $tmp 'Program.cs') -Value "class P { static void Main(string[] a) { $cs } }"
dotnet new console -n KeyGen -o $tmp --force | Out-Null
dotnet run --project $tmp -- $priv $pub
Write-Host "Claves en:" $priv "y" $pub
