# fzlaunchpad

A lightweight React TypeScript static website to display machine information and service statuses.

**Built by [Mohammad Afzal](https://afzalex.com)**

fzlaunchpad is a modern, configurable dashboard for monitoring service health and displaying machine information. It features real-time health checks, customizable themes, and support for both Font Awesome and Material Design icons.

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

### Pull from Docker Hub

Pre-built Docker images are automatically pushed to Docker Hub on every push to main/master:

```bash
docker pull afzalex/fzlaunchpad:latest
docker run -d -p 8080:80 afzalex/fzlaunchpad:latest
```

### Build the Docker image locally

```bash
docker build -t fzlaunchpad .
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

Edit `public/config.yaml` to customize your launchpad. The configuration file uses YAML format and supports the following sections:

### Server Configuration

Configure the header section with server information:

```yaml
server:
  name: "My Server on {hostname}"      # Server/machine name (required) - supports placeholders
  subtitle: "Server Description"       # Optional: Simple string subtitle - supports placeholders
  # OR use array format for flexible content:
  subtitle:
    - type: "text"
      content: "Macbook Air of "
    - type: "link"
      label: "Mohammad Afzal"
      url: "https://afzalex.com"
      target: "_blank"                  # Optional: Open in new tab (default: "_blank")
  headerContent: "Additional info"     # Optional: Additional content at bottom of header
  # OR use array format:
  headerContent:
    - type: "text"
      content: "Last updated: {year}"
    - type: "link"
      label: "View Details"
      url: "https://example.com"
      target: "_self"                   # Optional: Open in same page (default: "_blank")
```

### Services Configuration

Define services to monitor with health checks:

```yaml
services:
  - name: "Web Server on {hostname}"   # Service name (required) - supports placeholders
    description: "Main web application running since {date}" # Service description (required) - supports placeholders
    icon: "MdComputer"                  # Icon name (required) - see Icons section
    url: "https://{hostname}/app"      # Optional: URL to open when clicking the card - supports placeholders
    healthCheckUrl: "https://{hostname}/health"  # Optional: URL for health check - supports placeholders
```

**Note:** If `healthCheckUrl` is not provided, no status indicator will be shown for that service.

### Footer Configuration

Customize the footer content:

```yaml
footer:
  enabled: true                         # Show/hide footer (default: true)
  content:
    - type: "text"
      content: "Custom footer text"
    - type: "link"
      label: "GitHub"
      url: "https://github.com/example"
      target: "_blank"                  # Optional: HTML target attribute (default: "_blank")
    - type: "link"
      label: "Internal Link"
      url: "/dashboard"
      target: "_self"                   # Open in same page
```

**Link target values:**
- `_blank` - Opens in a new tab/window (default)
- `_self` - Opens in the same frame (same page)
- `_parent` - Opens in the parent frame
- `_top` - Opens in the full body of the window
- Custom frame name - Opens in a named frame

### Theme Configuration

Customize colors and background:

```yaml
theme:
  backgroundImage:
    url: "/images/background.jpg"      # Background image URL (optional)
    opacity: 1                          # Opacity 0.0 to 1.0 (default: 0.1)
    position: "center"                 # CSS background-position (default: center)
    size: "cover"                       # CSS background-size (default: cover)
    repeat: "no-repeat"                # CSS background-repeat (default: no-repeat)
  colors:
    background: "#fafaff"              # Main page background color
    cardBackground: "#eef0f2"          # Service card background color
    mediumAccent: "#ecebe4"            # Medium accent color
    darkAccent: "#daddd8"              # Dark accent color
    text: "#1c1c1c"                    # Text color
    headerBackground: "#1c1c1c"         # Header background color
    headerText: "#eef0f2"              # Header text color
    footerBackground: "#fafaff"         # Footer background color (optional)
    footerText: "#1c1c1c"              # Footer text color (optional)
    serviceStatus:                      # Status code to color mappings
      "0": "#808080"                   # Status code 0 (stopped/unreachable)
      "200-299": "#10b981"             # Status codes 200-299 (success)
      "300-399": "#3b82f6"             # Status codes 300-399 (redirect)
      "400-499": "#ef4444"              # Status codes 400-499 (client error)
      "500-599": "#f59e0b"              # Status codes 500-599 (server error)
      "checking": "#3b82f6"             # Checking status (before first response)
      # You can also map specific status codes:
      "401": "#009d24"                  # Status code 401 (custom mapping)
      "404": "#808080"                   # Status code 404 (custom mapping)
```

### Status Mapping Configuration

Map HTTP status codes to status names:

```yaml
statusMapping:
  "0": "stopped"                       # Status code 0 (stopped/unreachable)
  "200-299": "running"                 # Status codes 200-299 (success)
  "300-399": "unknown"                 # Status codes 300-399 (redirect)
  "400-499": "error"                    # Status codes 400-499 (client error)
  "500-599": "warning"                 # Status codes 500-599 (server error)
  # You can also map specific status codes:
  "401": "Running (Secured)"           # Status code 401 (custom mapping)
  "404": "Not Available"               # Status code 404 (custom mapping)
```

**Note:** Status codes can be specified as:
- Single code: `"200"` - matches exactly 200
- Range: `"200-299"` - matches all codes from 200 to 299 (inclusive)

### Placeholders

You can use placeholders in all content-related fields from config.yaml. Placeholders work in:
- **Server name**: `server.name`
- **Subtitle**: `server.subtitle` (both string and array formats)
- **Header content**: `server.headerContent` (both string and array formats)
- **Service name**: `services[].name`
- **Service description**: `services[].description`
- **Service URL**: `services[].url` (used when clicking the service card)
- **Service health check URL**: `services[].healthCheckUrl` (used for health monitoring)
- **Footer content**: `footer.content` (text `content`, link `label`, and link `url` fields)

#### Date/Time Placeholders
- `{year}` - Current year (e.g., `2024`)
- `{month}` - Current month number (e.g., `01` for January)
- `{monthName}` - Current month name (e.g., `January`)
- `{monthShort}` - Current month short name (e.g., `Jan`)
- `{day}` - Day of month (e.g., `15`)
- `{weekday}` - Day of week name (e.g., `Monday`)
- `{weekdayShort}` - Day of week short name (e.g., `Mon`)
- `{date}` - Full date in ISO format (e.g., `2024-01-15`)
- `{dateUS}` - US date format (e.g., `01/15/2024`)
- `{dateEU}` - EU date format (e.g., `15/01/2024`)
- `{time}` - Current time in 24-hour format (e.g., `14:30:45`)
- `{time12}` - Current time in 12-hour format (e.g., `2:30 PM`)
- `{hour}` - Current hour in 24-hour format (e.g., `14`)
- `{hour12}` - Current hour in 12-hour format (e.g., `2`)
- `{minute}` - Current minute (e.g., `30`)
- `{second}` - Current second (e.g., `45`)
- `{ampm}` - AM/PM indicator (e.g., `PM`)

#### URL Placeholders
- `{url}` - Full URL (e.g., `https://example.com/path?query=value#hash`)
- `{hostname}` - Hostname (e.g., `example.com`)
- `{host}` - Host with port if present (e.g., `example.com:8080`)
- `{pathname}` - Pathname (e.g., `/path/to/page`)
- `{origin}` - Origin (e.g., `https://example.com`)
- `{protocol}` - Protocol (e.g., `https:`)
- `{port}` - Port if present (e.g., `8080`)
- `{search}` - Query string (e.g., `?key=value`)
- `{hash}` - Hash (e.g., `#section`)

**Examples:**

In text content:
```yaml
footer:
  content:
    - type: "text"
      content: "© {year} | Last updated: {date} {time} | Current URL: {url}"
    - type: "text"
      content: "Today is {weekday}, {monthName} {day}, {year}"
```

In link labels and URLs:
```yaml
server:
  subtitle:
    - type: "link"
      label: "Visit {hostname}"
      url: "https://{hostname}/dashboard"
  headerContent:
    - type: "link"
      label: "View on {origin}"
      url: "{origin}/status"
```

### Icons

Icons are supported from two icon libraries:

#### Font Awesome Icons
Icons starting with `Fa` prefix (e.g., `FaCode`, `FaCloud`, `FaYoutube`)

**Browse icons:** [React Icons - Font Awesome](https://react-icons.github.io/react-icons/icons/fa/)

**Examples:**
- `FaCode` - Code icon
- `FaCloud` - Cloud icon
- `FaYoutube` - YouTube icon
- `FaGithub` - GitHub icon

#### Material Design Icons
Icons starting with `Md` prefix (e.g., `MdComputer`, `MdApps`, `MdFolderOpen`)

**Browse icons:** 
- [Google Material Icons](https://fonts.google.com/icons)
- [React Icons - Material Design](https://react-icons.github.io/react-icons/icons/md/)

**Examples:**
- `MdComputer` - Computer icon
- `MdApps` - Apps icon
- `MdFolderOpen` - Folder icon
- `MdHub` - Hub icon

**Usage in config:**
```yaml
services:
  - name: "Web Server"
    icon: "MdComputer"    # Material Design icon
  - name: "API Service"
    icon: "FaCode"        # Font Awesome icon
```

### Complete Example

Here's a complete example `config.yaml`:

```yaml
server:
  name: "My Server"
  subtitle:
    - type: "text"
      content: "Server running on {hostname}"
    - type: "link"
      label: "View Details"
      url: "https://example.com"
  headerContent:
    - type: "text"
      content: "Last updated: {year}"

services:
  - name: "Web Server"
    description: "Main web application server"
    icon: "MdComputer"
    url: "http://localhost:5173"
    healthCheckUrl: "http://localhost:5173"
  - name: "API Service"
    description: "REST API backend service"
    icon: "FaCode"
    url: "http://localhost:3000"
    healthCheckUrl: "http://localhost:3000/health"

footer:
  enabled: true
  content:
    - type: "text"
      content: "© {year} My Company"
    - type: "link"
      label: "GitHub"
      url: "https://github.com/example"

theme:
  backgroundImage:
    url: "/images/background.jpg"
    opacity: 0.8
    position: "center"
    size: "cover"
    repeat: "no-repeat"
  colors:
    background: "#fafaff"
    cardBackground: "#eef0f2"
    mediumAccent: "#ecebe4"
    darkAccent: "#daddd8"
    text: "#1c1c1c"
    headerBackground: "#1c1c1c"
    headerText: "#eef0f2"
    footerBackground: "#fafaff"
    footerText: "#1c1c1c"
    serviceStatus:
      "0": "#808080"
      "200-299": "#10b981"
      "300-399": "#3b82f6"
      "400-499": "#ef4444"
      "500-599": "#f59e0b"
      "checking": "#3b82f6"

statusMapping:
  "0": "stopped"
  "200-299": "running"
  "300-399": "unknown"
  "400-499": "error"
  "500-599": "warning"
```
