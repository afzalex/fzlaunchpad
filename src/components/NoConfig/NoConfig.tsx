import './NoConfig.css';

export default function NoConfig() {
  return (
    <div className="no-config">
      <div className="no-config-content">
        <h1>Configuration File Not Found</h1>
        <p>Please add a configuration file to get started:</p>
        <ul>
          <li><code>public/config.yaml</code></li>
          <li><code>public/config1.yaml</code></li>
          <li><code>public/config2.yaml</code></li>
          <li><code>public/config3.yaml</code></li>
        </ul>
        <p className="no-config-hint">
          The application will automatically use the first available config file from the list above.
        </p>
        <p className="no-config-docs">
          See <a href="https://github.com/afzalex/fzlaunchpad#configuration" target="_blank" rel="noopener noreferrer">README.md</a> for configuration examples.
        </p>
      </div>
    </div>
  );
}

