# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Feed local EcuNexo.Core (NuGet) — ruta relativa de NuGet.Config: ../nuget-local
COPY nuget-local/ /src/nuget-local/
COPY ecunexo_license_api/NuGet.Config ./ecunexo_license_api/
COPY ecunexo_license_api/Directory.Build.props ./ecunexo_license_api/
COPY ecunexo_license_api/Directory.Packages.props ./ecunexo_license_api/
COPY ecunexo_license_api/EcuNexo.Platform.slnx ./ecunexo_license_api/
COPY ecunexo_license_api/src/ ./ecunexo_license_api/src/

WORKDIR /src/ecunexo_license_api
RUN dotnet restore src/EcuNexo.Platform.Api/EcuNexo.Platform.Api.csproj
RUN dotnet publish src/EcuNexo.Platform.Api/EcuNexo.Platform.Api.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
COPY --from=build /app/publish .
# Montar en runtime: /keys/license-private.pem (solo lectura)
RUN mkdir -p /keys && chmod 755 /keys
ENTRYPOINT ["dotnet", "EcuNexo.Platform.Api.dll"]
