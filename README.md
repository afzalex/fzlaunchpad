# fzlaunchpad

A lightweight React TypeScript static website to display machine information and service statuses.

## Features

- Display machine name and status in a header
- Show multiple service cards with status indicators
- Configurable via YAML file (`public/config.yaml`)
- Health check monitoring for services
- Customizable theme and colors
- Docker support for easy deployment

## Downloads

Pre-built packages are automatically created on every push to main/master:

1. **GitHub Releases**: Go to the [Releases](https://github.com/yourusername/fzlaunchpad/releases) page to download the latest build. Each push creates a new release with:
   - `fzlaunchpad.zip` - ZIP archive
   - `fzlaunchpad.tar.gz` - tar.gz archive

2. **GitHub Actions Artifacts**: Alternatively, go to the [Actions](https://github.com/yourusername/fzlaunchpad/actions) tab, select the latest workflow run, and download the artifacts directly.

The build artifacts contain the complete static website ready to deploy. No need to build from source - just download and deploy!

## Docker

### Build the Docker image

```bash
docker build -t fzlaunchpad .
```

### Run the container

```bash
docker run -d -p 8080:80 fzlaunchpad
```

The application will be available at `http://localhost:8080`.

### Customize configuration

To use a custom `config.yaml`, you can mount it as a volume:

```bash
docker run -d -p 8080:80 -v /path/to/your/config.yaml:/usr/share/caddy/config.yaml fzlaunchpad
```

Or rebuild the image with your config file in the `public/` directory.

## Configuration

Edit `public/config.yaml` to customize:
- Server name and subtitle
- Services list with health check URLs
- Theme colors and background image
- Status mappings for HTTP status codes
- Footer content
